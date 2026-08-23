import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  COUPONS,
  PRODUCTS,
  checkPincode,
  enrichCatalog,
  findProduct,
  insiderTier,
} from '../data/products'

const StoreContext = createContext(null)
const KEY = 'trendora-store-v2'

export function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export const SEED_USERS = [
  { id: 'u-owner', name: 'Priya Shah', email: 'owner@trendora.in', password: 'owner123', phone: '9000000001', role: 'owner', points: 3200, shopName: 'Trendora HQ', blocked: false, joined: '2025-06-01T10:00:00.000Z' },
  { id: 'u-admin', name: 'Rahul Desai', email: 'admin@trendora.in', password: 'admin123', phone: '9000000002', role: 'admin', points: 200, shopName: '', blocked: false, joined: '2025-07-12T10:00:00.000Z' },
  { id: 'u-seller', name: 'Meera Crafts', email: 'seller@trendora.in', password: 'seller123', phone: '9000000003', role: 'seller', points: 120, shopName: 'Meera Crafts', blocked: false, joined: '2025-08-02T10:00:00.000Z' },
  { id: 'u-demo', name: 'Aisha Verma', email: 'demo@trendora.in', password: 'demo123', phone: '9876543210', role: 'customer', points: 860, shopName: '', blocked: false, joined: '2025-09-18T10:00:00.000Z' },
]

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
  const [user, setUser] = useState(saved?.user || null)
  const [users, setUsers] = useState(saved?.users || SEED_USERS)
  const [products, setProducts] = useState(saved?.products || enrichCatalog(PRODUCTS))
  const [cart, setCart] = useState(saved?.cart || [])
  const [wishlist, setWishlist] = useState(saved?.wishlist || [])
  const [orders, setOrders] = useState(saved?.orders || [])
  const [coupon, setCoupon] = useState(saved?.coupon || null)
  const [coupons, setCoupons] = useState(saved?.coupons || seedCoupons())
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
    localStorage.setItem(
      KEY,
      JSON.stringify({
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
      })
    )
  }, [user, users, products, cart, wishlist, orders, coupon, coupons, addresses, reviews, questions, returns, tickets, notifications, recent, compare, giftWrap, settings])

  const toast = (message, type = 'ok') => {
    const id = uid('t')
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }

  const notify = (userId, title, text) => {
    setNotifications((list) => [{ id: uid('n'), userId, title, text, read: false, at: new Date().toISOString() }, ...list])
  }

  const afterLogin = (found) => {
    if (found.blocked) return { ok: false, error: 'This account is blocked. Contact the owner.' }
    setUser(strip(found))
    toast(`Signed in as ${found.role}: ${found.name.split(' ')[0]}`)
    return { ok: true, role: found.role }
  }

  const register = ({ name, email, password, phone, role = 'customer', shopName = '' }) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const allowed = role === 'seller' ? 'seller' : 'customer'
    const next = {
      id: uid('u'),
      name,
      email,
      password,
      phone,
      role: allowed,
      points: 0,
      shopName: allowed === 'seller' ? shopName || `${name}'s shop` : '',
      blocked: false,
      joined: new Date().toISOString(),
    }
    setUsers((list) => [...list, next])
    setUser(strip(next))
    toast(`Welcome, ${name.split(' ')[0]}`)
    return { ok: true, role: next.role }
  }

  const login = ({ email, password }) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) return { ok: false, error: 'Invalid email or password.' }
    return afterLogin(found)
  }

  const loginAs = (email) => {
    const found = users.find((u) => u.email === email)
    if (!found) return { ok: false, error: 'Demo user missing.' }
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
    toast('Added to bag')
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
    if (!cartDetailed.length) return { ok: false, error: 'Your bag is empty.' }
    const pin = checkPincode(address.pin)
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
      address,
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

  const requestReturn = ({ orderId, reason, itemId }) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order || order.status !== 'Delivered') return { ok: false, error: 'Return is only for delivered orders.' }
    const rec = {
      id: uid('ret'),
      orderId,
      itemId,
      userId: user?.id,
      reason,
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
    const rec = { id: uid('rv'), productId, userId: user.id, name: user.name, rating, text, at: new Date().toISOString() }
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
      { id: uid('q'), productId, userId: user.id, name: user.name.split(' ')[0], question, answer: '', at: new Date().toISOString() },
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

  const upsertProduct = (payload) => {
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
      sellerId: user?.role === 'seller' ? user.id : payload.sellerId || user?.id || 'u-owner',
      ...payload,
      id,
    }
    setProducts((list) => [next, ...list])
    toast('Product listed')
    return id
  }

  const removeProduct = (id) => {
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

  const createStaff = ({ name, email, password, phone, role, shopName }) => {
    if (!['admin', 'seller', 'customer'].includes(role)) return { ok: false, error: 'Invalid role.' }
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return { ok: false, error: 'Email exists.' }
    const next = { id: uid('u'), name, email, password, phone, role, points: 0, shopName: shopName || '', blocked: false, joined: new Date().toISOString() }
    setUsers((list) => [...list, next])
    toast(`${role} created`)
    return { ok: true }
  }

  const setUserBlocked = (id, blocked) => {
    if (id === 'u-owner') return toast('Owner cannot be blocked', 'warn')
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, blocked } : u)))
    if (user?.id === id && blocked) setUser(null)
    toast(blocked ? 'User blocked' : 'User unblocked')
  }

  const setUserRole = (id, role) => {
    if (id === 'u-owner') return toast('Owner role is locked', 'warn')
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
    staff: ['admin', 'owner', 'seller'].includes(user?.role),
    admin: ['admin', 'owner'].includes(user?.role),
    owner: user?.role === 'owner',
    seller: user?.role === 'seller',
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
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
