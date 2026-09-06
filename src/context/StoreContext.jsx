import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  COUPONS,
  PRODUCTS,
  checkPincode,
  enrichCatalog,
  findProduct,
  insiderTier,
} from '../data/products'
import {
  checkOtp,
  cleanText,
  clearLoginFails,
  issueOtp,
  loginAllowed,
  passwordsMatch,
  recordLoginFail,
  safeStore,
  sha256,
  validEmail,
  validPhone,
} from '../lib/security'

const StoreContext = createContext(null)
const KEY = 'trendora-store-v2'

export function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

const ALLOWED_ROLES = ['admin', 'customer']

export const SEED_USERS = [
  { id: 'u-admin', name: 'Store Admin', email: 'admin@trendora.in', password: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', phone: '9000000002', role: 'admin', points: 200, shopName: '', blocked: false, joined: '2025-07-12T10:00:00.000Z' },
  { id: 'u-demo', name: 'Aisha Verma', email: 'demo@trendora.in', password: 'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791', phone: '9876543210', role: 'customer', points: 860, shopName: '', blocked: false, joined: '2025-09-18T10:00:00.000Z' },
]

function keepAccounts(list = []) {
  return list.filter((u) => u && ALLOWED_ROLES.includes(u.role) && !['owner@trendora.in', 'seller@trendora.in', 'reseller@trendora.in'].includes(u.email))
}

function seedCoupons() {
  return Object.entries(COUPONS).map(([code, c]) => ({ code, ...c, active: true }))
}

function seedReviews() {
  return [
    { id: 'rv-1', productId: 'td-1001', userId: 'u-demo', name: 'Aisha V.', rating: 5, text: 'Fabric is light and the print looks richer than the photo. True to size M.', at: '2026-01-12T09:00:00.000Z' },
    { id: 'rv-2', productId: 'td-1302', userId: 'u-demo', name: 'Aisha V.', rating: 4, text: 'ANC is solid on the bus. Case is tiny — love it.', at: '2026-02-03T09:00:00.000Z' },
    { id: 'rv-3', productId: 'td-1601', userId: 'u-admin', name: 'Rahul D.', rating: 5, text: 'Daily white sneaker that actually stays white.', at: '2026-03-21T09:00:00.000Z' },
  ]
}

function seedQuestions() {
  return [
    { id: 'q-1', productId: 'td-1001', userId: 'u-demo', name: 'Aisha', question: 'Is this lined?', answer: 'Yes, the bodice is lined. Skirt is single layer georgette.', at: '2026-01-20T09:00:00.000Z' },
  ]
}

function pickStyle(p) {
  return {
    slot: p.slot,
    moods: p.moods,
    ecoScore: p.ecoScore,
    student: p.student,
  }
}

function strip(u) {
  if (!u) return null
  const { password, ...rest } = u
  return rest
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    if (!raw || raw.version !== 2) return null
    return raw
  } catch {
    return null
  }
}

export function StoreProvider({ children }) {
  const saved = load()
  const [user, setUser] = useState(() => {
    const u = saved?.user || null
    if (u && !ALLOWED_ROLES.includes(u.role)) return null
    return u
  })
  const [users, setUsers] = useState(() => {
    const base = keepAccounts(saved?.users || SEED_USERS)
    const missing = SEED_USERS.filter((s) => !base.some((u) => u.email === s.email))
    const merged = keepAccounts([...base, ...missing])
    return merged.map((u) => {
      const seed = SEED_USERS.find((s) => s.email === u.email)
      if (seed && u.password && u.password.length < 40) return { ...u, password: seed.password }
      return u
    })
  })
  const [referral, setReferral] = useState(saved?.referral || null)
  const [shares, setShares] = useState(saved?.shares || [])
  const [products, setProducts] = useState(() => {
    const fresh = enrichCatalog(PRODUCTS)
    const base = saved?.products || fresh
    const missing = fresh.filter((p) => !base.some((x) => x.id === p.id))
    return enrichCatalog(
      [...missing, ...base].map((p) => {
        const seed = fresh.find((s) => s.id === p.id)
        return seed ? { ...p, ...pickStyle(seed), image: seed.image, gallery: seed.gallery, name: seed.name } : p
      })
    )
  })
  const [cart, setCart] = useState(saved?.cart || [])
  const [wishlist, setWishlist] = useState(saved?.wishlist || [])
  const [orders, setOrders] = useState(saved?.orders || [])
  const [coupon, setCoupon] = useState(saved?.coupon || null)
  const [coupons, setCoupons] = useState(() => {
    const base = saved?.coupons || seedCoupons()
    seedCoupons().forEach((c) => {
      if (!base.some((x) => x.code === c.code)) base.push(c)
    })
    return base
  })
  const [addresses, setAddresses] = useState(saved?.addresses || [])
  const [reviews, setReviews] = useState(saved?.reviews || seedReviews())
  const [questions, setQuestions] = useState(saved?.questions || seedQuestions())
  const [returns, setReturns] = useState(saved?.returns || [])
  const [tickets, setTickets] = useState(saved?.tickets || [])
  const [notifications, setNotifications] = useState(saved?.notifications || [
    { id: 'n-1', userId: 'all', title: 'Festive edit is live', text: 'Use FESTIVE20 on carts above ₹1,999.', read: false, at: new Date().toISOString() },
  ])
  const [recent, setRecent] = useState(saved?.recent || [])
  const [compare, setCompare] = useState(saved?.compare || [])
  const [giftWrap, setGiftWrap] = useState(saved?.giftWrap || false)
  const [studentMode, setStudentMode] = useState(Boolean(saved?.studentMode))
  const [budgetLock, setBudgetLock] = useState(saved?.budgetLock || 0)
  const [styleMood, setStyleMood] = useState(saved?.styleMood || '')
  const [settings, setSettings] = useState(
    saved?.settings || {
      storeName: 'Trendora',
      announcement: 'Festive edit is live · FESTIVE20 · Free delivery above ₹999',
      freeShipMin: 999,
      shipFee: 79,
      commission: 12,
      returnDays: 7,
      tryAndBuy: true,
    }
  )
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const mark = () => {
      sessionStorage.setItem('trendora-active', String(Date.now()))
    }
    mark()
    const onMove = () => mark()
    window.addEventListener('pointerdown', onMove)
    window.addEventListener('keydown', onMove)
    const t = setInterval(() => {
      const last = Number(sessionStorage.getItem('trendora-active') || Date.now())
      if (Date.now() - last > 30 * 60 * 1000) {
        setUser(null)
        sessionStorage.removeItem('trendora-active')
      }
    }, 60 * 1000)
    return () => {
      window.removeEventListener('pointerdown', onMove)
      window.removeEventListener('keydown', onMove)
      clearInterval(t)
    }
  }, [])

  useEffect(() => {
    const ok = safeStore(KEY, {
      version: 2,
      user,
      users,
      products,
      cart,
      wishlist,
      orders,
      coupon,
      coupons,
      addresses,
      reviews,
      questions,
      returns,
      tickets,
      notifications,
      recent,
      compare,
      giftWrap,
      settings,
      referral,
      shares,
      studentMode,
      budgetLock,
      styleMood,
    })
    if (!ok) toast('Storage is full. Clear site data if the bag will not save.', 'warn')
  }, [user, users, products, cart, wishlist, orders, coupon, coupons, addresses, reviews, questions, returns, tickets, notifications, recent, compare, giftWrap, settings, referral, shares, studentMode, budgetLock, styleMood])

  const toast = (message, type = 'ok') => {
    const id = uid('t')
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }

  const notify = (userId, title, text) => {
    setNotifications((list) => [{ id: uid('n'), userId, title, text, read: false, at: new Date().toISOString() }, ...list])
  }

  const afterLogin = (found) => {
    if (found.blocked) return { ok: false, error: 'This account is blocked. Contact the store admin.' }
    setUser(strip(found))
    toast(`Signed in as ${found.role}: ${found.name.split(' ')[0]}`)
    return { ok: true, role: found.role }
  }

  const beginRegister = async ({ name, email, password, phone, role = 'customer', shopName = '' }) => {
    const cleanName = cleanText(name, 80)
    const cleanMail = cleanText(email, 120).toLowerCase()
    if (!validEmail(cleanMail)) return { ok: false, error: 'Enter a valid email address.' }
    if (!validPhone(phone)) return { ok: false, error: 'Enter a 10-digit Indian mobile number.' }
    if (String(password).length < 6) return { ok: false, error: 'Password should be at least 6 characters.' }
    if (users.some((u) => u.email.toLowerCase() === cleanMail)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const allowed = 'customer'
    const otp = issueOtp({ email: cleanMail, phone, purpose: 'register' })
    toast(`OTP sent to ${phone} (simulated)`)
    return {
      ok: true,
      needsOtp: true,
      demoCode: otp.code,
      pending: { name: cleanName, email: cleanMail, password, phone: String(phone).replace(/\s/g, ''), role: allowed, shopName },
    }
  }

  const finishRegister = async ({ pending, code }) => {
    const gate = checkOtp(pending.email, code)
    if (!gate.ok) return { ok: false, error: gate.error }
    return register({ ...pending, skipOtp: true })
  }

  const register = async ({ name, email, password, phone, role = 'customer', shopName = '', skipOtp = false }) => {
    const cleanName = cleanText(name, 80)
    const cleanMail = cleanText(email, 120).toLowerCase()
    if (!validEmail(cleanMail)) return { ok: false, error: 'Enter a valid email address.' }
    if (!validPhone(phone)) return { ok: false, error: 'Enter a 10-digit Indian mobile number.' }
    if (String(password).length < 6) return { ok: false, error: 'Password should be at least 6 characters.' }
    if (users.some((u) => u.email.toLowerCase() === cleanMail)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const allowed = 'customer'
    if (!skipOtp) {
      return beginRegister({ name, email, password, phone, role: 'customer', shopName })
    }
    const hashed = await sha256(password)
    const next = {
      id: uid('u'),
      name: cleanName,
      email: cleanMail,
      password: hashed,
      phone: String(phone).replace(/\s/g, ''),
      role: allowed,
      points: 0,
      shopName: allowed !== 'customer' ? cleanText(shopName, 80) || `${cleanName}'s shop` : '',
      blocked: false,
      verified: true,
      twoFactor: allowed === 'customer',
      joined: new Date().toISOString(),
    }
    setUsers((list) => [...list, next])
    setUser(strip(next))
    toast(`Welcome, ${cleanName.split(' ')[0]}`)
    return { ok: true, role: next.role }
  }

  const login = async ({ email, password, staff = false }) => {
    const gate = loginAllowed()
    if (!gate.ok) return { ok: false, error: `Too many attempts. Try again in ${gate.wait}s.` }
    const found = users.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase())
    const cleanMail = cleanText(email, 120).toLowerCase()
    if (!staff) {
      if (!validEmail(cleanMail)) return { ok: false, error: 'Enter a valid email address.' }
      if (found && found.role !== 'customer') {
        return { ok: false, error: 'This sign-in is for customers only. Admin uses the private /staff desk.' }
      }
      if (found && !(await passwordsMatch(found.password, password))) {
        const fail = recordLoginFail()
        return { ok: false, error: fail.locked ? 'Too many attempts. Locked for 30 seconds.' : 'Invalid email or password.' }
      }
      if (!found && String(password).length < 6) {
        return { ok: false, error: 'Password should be at least 6 characters for a new email.' }
      }
      clearLoginFails()
      const otp = issueOtp({ email: cleanMail, phone: found?.phone || '', purpose: 'login' })
      toast('Step 2: enter OTP 1923')
      const pendingNew = found
        ? null
        : {
            name: cleanText(cleanMail.split('@')[0].replace(/[._-]+/g, ' ') || 'Customer', 80),
            email: cleanMail,
            password,
            phone: '9876500000',
          }
      return { ok: true, needsOtp: true, email: cleanMail, role: 'customer', demoCode: otp.code, pendingNew }
    }
    if (!found || !(await passwordsMatch(found.password, password))) {
      const fail = recordLoginFail()
      return { ok: false, error: fail.locked ? 'Too many attempts. Locked for 30 seconds.' : 'Invalid email or password.' }
    }
    if (staff && found.role !== 'admin') {
      return { ok: false, error: 'This desk is only for the store admin.' }
    }
    clearLoginFails()
    if (found.role === 'customer') {
      const otp = issueOtp({ email: found.email, phone: found.phone, purpose: 'login' })
      toast('Step 2: enter the OTP sent to your mobile (simulated)')
      return { ok: true, needsOtp: true, email: found.email, role: found.role, demoCode: otp.code }
    }
    return afterLogin(found)
  }

  const confirmLoginOtp = async ({ email, code, pendingNew }) => {
    const mail = String(email).trim().toLowerCase()
    const gate = checkOtp(mail, code)
    if (!gate.ok) return { ok: false, error: gate.error }
    const found = users.find((u) => u.email.toLowerCase() === mail)
    if (!found && pendingNew) return register({ ...pendingNew, skipOtp: true })
    if (!found) return { ok: false, error: 'Account missing.' }
    return afterLogin({ ...found, verified: true })
  }

  const resendOtp = ({ email, phone, purpose }) => {
    const otp = issueOtp({ email, phone, purpose })
    toast('New OTP sent (simulated)')
    return { ok: true, demoCode: otp.code }
  }

  const loginAs = (email) => {
    const found = users.find((u) => u.email === email)
    if (!found) return { ok: false, error: 'Demo user missing.' }
    if (!ALLOWED_ROLES.includes(found.role)) return { ok: false, error: 'This account type is not used in the project.' }
    return afterLogin(found)
  }

  const loginDemo = () => loginAs('demo@trendora.in')

  const logout = () => {
    setUser(null)
    toast('You have been signed out')
  }

  const updateProfile = (patch) => {
    if (!user) return
    const next = { ...user, ...patch }
    setUser(next)
    setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, ...patch } : u)))
    toast('Profile updated')
  }

  const getProduct = (id) => findProduct(products, id)

  const addToCart = (productId, { color, size, qty = 1 } = {}) => {
    const product = getProduct(productId)
    if (!product || product.status === 'hidden') return
    if (product.stock < 1) {
      toast('Out of stock', 'warn')
      return
    }
    setCart((items) => {
      const i = items.findIndex(
        (x) => x.id === productId && x.color === (color || product.colors[0]) && x.size === (size || product.sizes[0])
      )
      if (i >= 0) {
        const copy = [...items]
        copy[i] = { ...copy[i], qty: Math.min(copy[i].qty + qty, product.stock) }
        return copy
      }
      return [...items, { id: productId, color: color || product.colors[0], size: size || product.sizes[0], qty }]
    })
    toast('Added to cart')
  }

  const updateQty = (index, qty) => {
    setCart((items) => {
      const copy = [...items]
      const product = getProduct(copy[index].id)
      copy[index] = { ...copy[index], qty: Math.max(1, Math.min(qty, product?.stock || 1)) }
      return copy
    })
  }

  const removeFromCart = (index) => {
    setCart((items) => items.filter((_, i) => i !== index))
    toast('Removed from bag', 'warn')
  }

  const clearCart = () => setCart([])

  const toggleWishlist = (productId) => {
    setWishlist((ids) => {
      if (ids.includes(productId)) {
        toast('Removed from wishlist', 'warn')
        return ids.filter((id) => id !== productId)
      }
      toast('Saved to wishlist')
      return [...ids, productId]
    })
  }

  const applyCoupon = (code) => {
    const key = code.trim().toUpperCase()
    const found = coupons.find((c) => c.code === key && c.active)
    if (!found) return { ok: false, error: 'This coupon is not valid.' }
    if (found.code === 'INSIDER15' && (user?.points || 0) < 800) {
      return { ok: false, error: 'INSIDER15 is for Elite / Icon members.' }
    }
    if (found.code === 'CAMPUS10' && !studentMode) {
      return { ok: false, error: 'Turn on Student Mode for CAMPUS10.' }
    }
    setCoupon(found)
    toast(`Coupon ${key} applied`)
    return { ok: true }
  }

  const clearCoupon = () => setCoupon(null)

  const saveAddress = (address) => {
    const next = { id: address.id || uid('a'), userId: user?.id || 'guest', ...address }
    setAddresses((list) => {
      const i = list.findIndex((a) => a.id === next.id)
      if (i >= 0) {
        const copy = [...list]
        copy[i] = next
        return copy
      }
      return [...list, next]
    })
    return next
  }

  const deleteAddress = (id) => setAddresses((list) => list.filter((a) => a.id !== id))

  const cartDetailed = useMemo(
    () =>
      cart
        .map((line) => {
          const product = getProduct(line.id)
          if (!product) return null
          return { ...line, product, lineTotal: product.price * line.qty }
        })
        .filter(Boolean),
    [cart, products]
  )

  const totals = useMemo(() => {
    const subtotal = cartDetailed.reduce((s, l) => s + l.lineTotal, 0)
    const mrpTotal = cartDetailed.reduce((s, l) => s + l.product.mrp * l.qty, 0)
    const productSave = mrpTotal - subtotal
    let discount = 0
    let shipping = subtotal === 0 ? 0 : subtotal >= settings.freeShipMin ? 0 : settings.shipFee
    if (coupon) {
      if (coupon.type === 'percent' && subtotal >= coupon.min) discount = Math.round((subtotal * coupon.value) / 100)
      else if (coupon.type === 'flat' && subtotal >= coupon.min) discount = coupon.value
      else if (coupon.type === 'shipping') shipping = 0
    }
    const wrap = giftWrap ? 49 : 0
    const grand = Math.max(0, subtotal - discount + shipping + wrap)
    return {
      subtotal,
      mrpTotal,
      productSave,
      discount,
      shipping,
      wrap,
      grand,
      count: cartDetailed.reduce((s, l) => s + l.qty, 0),
    }
  }, [cartDetailed, coupon, giftWrap, settings])

  const placeOrder = ({ address, payment }) => {
    if (!user || user.role !== 'customer') return { ok: false, error: 'Please sign in to place an order.' }
    if (!cartDetailed.length) return { ok: false, error: 'Your bag is empty.' }
    const oos = cartDetailed.find((l) => l.qty > (l.product.stock || 0))
    if (oos) return { ok: false, error: `${oos.product.name} does not have enough stock.` }
    const cleanAddr = {
      name: cleanText(address.name, 80),
      phone: String(address.phone || '').replace(/\s/g, ''),
      line1: cleanText(address.line1, 160),
      city: cleanText(address.city, 60),
      state: cleanText(address.state, 60),
      pin: String(address.pin || '').replace(/\D/g, '').slice(0, 6),
    }
    if (!validPhone(cleanAddr.phone)) return { ok: false, error: 'Enter a 10-digit Indian mobile number.' }
    const pin = checkPincode(cleanAddr.pin)
    if (!pin.ok) return { ok: false, error: pin.error }
    const order = {
      id: `TRD${Date.now().toString().slice(-8)}`,
      placedAt: new Date().toISOString(),
      items: cartDetailed.map((l) => ({
        id: l.id,
        name: l.product.name,
        brand: l.product.brand,
        image: l.product.image,
        price: l.product.price,
        mrp: l.product.mrp,
        qty: l.qty,
        color: l.color,
        size: l.size,
        sellerId: l.product.sellerId,
      })),
      totals,
      coupon,
      address: cleanAddr,
      payment,
      giftWrap,
      status: 'Confirmed',
      timeline: [
        { label: 'Order placed', at: new Date().toISOString(), done: true },
        { label: 'Packed', at: null, done: false },
        { label: 'Shipped', at: null, done: false },
        { label: 'Out for delivery', at: null, done: false },
        { label: 'Delivered', at: null, done: false },
      ],
      userId: user?.id || 'guest',
      referralId: referral || null,
    }
    setOrders((list) => [order, ...list])
    setProducts((list) =>
      list.map((p) => {
        const line = cartDetailed.find((l) => l.id === p.id)
        return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p
      })
    )
    if (user) {
      const pts = Math.floor(totals.grand / 10)
      setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, points: (u.points || 0) + pts } : u)))
      setUser((u) => (u ? { ...u, points: (u.points || 0) + pts } : u))
      notify(user.id, 'Order confirmed', `${order.id} · we will pack it shortly.`)
    }
    if (referral && referral !== user?.id) {
      const cut = Math.round(totals.grand * 0.08)
      setShares((list) => [{ id: uid('sh'), resellerId: referral, orderId: order.id, amount: cut, at: new Date().toISOString() }, ...list])
      notify(referral, 'Reseller earning', `You earned ₹${cut} from order ${order.id}`)
    }
    setCart([])
    setCoupon(null)
    setGiftWrap(false)
    toast(`Order ${order.id} placed`)
    return { ok: true, order }
  }

  const STEPS = ['Confirmed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered']

  const setOrderStatus = (id, status) => {
    setOrders((list) =>
      list.map((o) => {
        if (o.id !== id) return o
        const idx = STEPS.indexOf(status)
        const timeline = o.timeline.map((t, i) => ({
          ...t,
          done: i <= idx,
          at: i <= idx ? t.at || new Date().toISOString() : null,
        }))
        return { ...o, status, timeline }
      })
    )
    toast(`Order ${id} → ${status}`)
  }

  const cancelOrder = (id) => {
    const order = orders.find((o) => o.id === id)
    if (!order) return { ok: false, error: 'Missing order' }
    if (['Shipped', 'Out for delivery', 'Delivered', 'Cancelled', 'Returned'].includes(order.status)) {
      return { ok: false, error: 'This order can no longer be cancelled.' }
    }
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: 'Cancelled' } : o)))
    setProducts((list) =>
      list.map((p) => {
        const line = order.items.find((i) => i.id === p.id)
        return line ? { ...p, stock: p.stock + line.qty } : p
      })
    )
    toast('Order cancelled', 'warn')
    return { ok: true }
  }

  const moveWishlistToBag = (productId) => {
    addToCart(productId)
    setWishlist((ids) => ids.filter((id) => id !== productId))
  }

  const captureReferral = (id) => {
    if (id) setReferral(id)
  }

  const shareProduct = (productId) => {
    if (!user || user.role !== 'customer') {
      toast('Sign in as a customer to share a product', 'warn')
      return ''
    }
    const link = `${window.location.origin}/product/${productId}?ref=${user.id}`
    navigator.clipboard?.writeText(link).catch(() => {})
    toast('Share link copied — Meesho-style catalogue share')
    return link
  }

  const requestReturn = ({ orderId, reason, itemId, kind = 'Return' }) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order || order.status !== 'Delivered') return { ok: false, error: 'Return / exchange is only for delivered orders.' }
    const rec = {
      id: uid('ret'),
      orderId,
      itemId,
      userId: user?.id,
      reason,
      kind,
      status: 'Requested',
      at: new Date().toISOString(),
    }
    setReturns((list) => [rec, ...list])
    toast('Return requested')
    notify(user?.id || 'guest', 'Return requested', rec.id)
    return { ok: true }
  }

  const setReturnStatus = (id, status) => {
    setReturns((list) => list.map((r) => (r.id === id ? { ...r, status } : r)))
    if (status === 'Refunded') {
      const rec = returns.find((r) => r.id === id)
      if (rec) setOrders((list) => list.map((o) => (o.id === rec.orderId ? { ...o, status: 'Returned' } : o)))
    }
    toast(`Return ${status}`)
  }

  const addReview = ({ productId, rating, text }) => {
    if (!user) return { ok: false, error: 'Login to review.' }
    const rec = { id: uid('rv'), productId, userId: user.id, name: user.name, rating, text: cleanText(text, 800), at: new Date().toISOString() }
    setReviews((list) => [rec, ...list])
    setProducts((list) =>
      list.map((p) => {
        if (p.id !== productId) return p
        const mine = reviews.filter((r) => r.productId === productId)
        const sum = mine.reduce((s, r) => s + r.rating, 0) + rating
        const count = mine.length + 1
        return { ...p, reviews: (p.reviews || 0) + 1, rating: Math.round((sum / count) * 10) / 10 }
      })
    )
    toast('Review published')
    return { ok: true }
  }

  const addQuestion = ({ productId, question }) => {
    if (!user) return { ok: false, error: 'Login to ask.' }
    setQuestions((list) => [
      { id: uid('q'), productId, userId: user.id, name: user.name.split(' ')[0], question: cleanText(question, 280), answer: '', at: new Date().toISOString() },
      ...list,
    ])
    toast('Question posted')
    return { ok: true }
  }

  const answerQuestion = (id, answer) => {
    setQuestions((list) => list.map((q) => (q.id === id ? { ...q, answer } : q)))
    toast('Answer saved')
  }

  const viewProduct = (id) => {
    setRecent((ids) => [id, ...ids.filter((x) => x !== id)].slice(0, 10))
  }

  const toggleCompare = (id) => {
    setCompare((ids) => {
      if (ids.includes(id)) return ids.filter((x) => x !== id)
      if (ids.length >= 3) {
        toast('Compare up to 3 styles', 'warn')
        return ids
      }
      toast('Added to compare')
      return [...ids, id]
    })
  }

  const canManageCatalog = () => user?.role === 'admin'

  const upsertProduct = (payload) => {
    if (!canManageCatalog()) {
      toast('Only the store admin can add or edit items', 'warn')
      return null
    }
    if (payload.id && products.some((p) => p.id === payload.id)) {
      setProducts((list) => list.map((p) => (p.id === payload.id ? { ...p, ...payload } : p)))
      toast('Product updated')
      return payload.id
    }
    const id = payload.id || `td-${Date.now().toString().slice(-6)}`
    const next = {
      colors: ['Default'],
      sizes: ['One Size'],
      tags: ['new'],
      gallery: [payload.image || '/images/cat-women.jpg'],
      image: payload.image || '/images/cat-women.jpg',
      highlights: ['Seller listed'],
      rating: 0,
      reviews: 0,
      stock: 10,
      status: 'active',
      returnable: true,
      sellerId: payload.sellerId || user?.id || 'u-admin',
      ...payload,
      id,
    }
    setProducts((list) => [next, ...list])
    toast('Product listed')
    return id
  }

  const removeProduct = (id) => {
    if (!canManageCatalog()) {
      toast('Only the store admin can hide items', 'warn')
      return
    }
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, status: 'hidden' } : p)))
    toast('Product hidden', 'warn')
  }

  const saveCoupon = (c) => {
    setCoupons((list) => {
      const i = list.findIndex((x) => x.code === c.code)
      if (i >= 0) {
        const copy = [...list]
        copy[i] = { ...copy[i], ...c }
        return copy
      }
      return [...list, { active: true, ...c }]
    })
    toast('Coupon saved')
  }

  const createStaff = async ({ name, email, password, phone, role, shopName }) => {
    if (!['customer'].includes(role)) return { ok: false, error: 'Only customer accounts can be created here. Admin is a single private login.' }
    if (!validEmail(email)) return { ok: false, error: 'Valid email required.' }
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return { ok: false, error: 'Email exists.' }
    const hashed = await sha256(password || 'pass123')
    const next = {
      id: uid('u'),
      name: cleanText(name, 80),
      email: cleanText(email, 120).toLowerCase(),
      password: hashed,
      phone,
      role,
      points: 0,
      shopName: cleanText(shopName, 80),
      blocked: false,
      joined: new Date().toISOString(),
    }
    setUsers((list) => [...list, next])
    toast(`${role} created`)
    return { ok: true }
  }

  const setUserBlocked = (id, blocked) => {
    if (id === 'u-admin') return toast('Admin cannot be blocked', 'warn')
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, blocked } : u)))
    if (user?.id === id && blocked) setUser(null)
    toast(blocked ? 'User blocked' : 'User unblocked')
  }

  const setUserRole = (id, role) => {
    if (id === 'u-admin') return toast('Admin role is locked', 'warn')
    if (role !== 'customer') return toast('This project only uses admin and customer accounts', 'warn')
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, role } : u)))
    toast('Role updated')
  }

  const openTicket = ({ subject, message }) => {
    const t = { id: uid('tk'), userId: user?.id || 'guest', name: user?.name || 'Guest', subject, message, status: 'Open', reply: '', at: new Date().toISOString() }
    setTickets((list) => [t, ...list])
    toast('Ticket opened')
    return t
  }

  const replyTicket = (id, reply, status = 'Replied') => {
    setTickets((list) => list.map((t) => (t.id === id ? { ...t, reply, status } : t)))
    toast('Reply sent')
  }

  const markNotesRead = () => {
    const uid_ = user?.id
    setNotifications((list) => list.map((n) => (n.userId === uid_ || n.userId === 'all' ? { ...n, read: true } : n)))
  }

  const myNotes = notifications.filter((n) => n.userId === 'all' || n.userId === user?.id)
  const unread = myNotes.filter((n) => !n.read).length
  const myOrders = orders.filter((o) => !user || user.role === 'customer' ? o.userId === (user?.id || 'guest') : true)
  const visibleProducts = products.filter((p) => p.status !== 'hidden')
  const tier = insiderTier(user?.points || 0)

  const can = {
    staff: ['admin', 'owner', 'seller', 'reseller'].includes(user?.role),
    admin: ['admin', 'owner'].includes(user?.role),
    owner: user?.role === 'owner',
    seller: user?.role === 'seller',
    reseller: user?.role === 'reseller',
    customer: !user || user.role === 'customer',
  }

  const value = {
    user,
    users,
    products,
    visibleProducts,
    cart,
    cartDetailed,
    wishlist,
    orders,
    myOrders,
    coupon,
    coupons,
    addresses,
    reviews,
    questions,
    returns,
    tickets,
    notifications: myNotes,
    unread,
    recent,
    compare,
    giftWrap,
    setGiftWrap,
    settings,
    setSettings,
    toasts,
    totals,
    tier,
    can,
    toast,
    register,
    beginRegister,
    finishRegister,
    confirmLoginOtp,
    resendOtp,
    login,
    loginAs,
    loginDemo,
    logout,
    updateProfile,
    getProduct,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    applyCoupon,
    clearCoupon,
    saveAddress,
    deleteAddress,
    placeOrder,
    setOrderStatus,
    cancelOrder,
    requestReturn,
    setReturnStatus,
    addReview,
    addQuestion,
    answerQuestion,
    viewProduct,
    toggleCompare,
    upsertProduct,
    removeProduct,
    saveCoupon,
    createStaff,
    setUserBlocked,
    setUserRole,
    openTicket,
    replyTicket,
    markNotesRead,
    checkPincode,
    referral,
    shares,
    captureReferral,
    shareProduct,
    moveWishlistToBag,
    studentMode,
    setStudentMode,
    budgetLock,
    setBudgetLock,
    styleMood,
    setStyleMood,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
