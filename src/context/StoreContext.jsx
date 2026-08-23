import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { COUPONS, getProduct } from '../data/products'

const StoreContext = createContext(null)
const KEY = 'trendora-store-v1'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function StoreProvider({ children }) {
  const saved = load()
  const [user, setUser] = useState(saved.user || null)
  const [users, setUsers] = useState(saved.users || [])
  const [cart, setCart] = useState(saved.cart || [])
  const [wishlist, setWishlist] = useState(saved.wishlist || [])
  const [orders, setOrders] = useState(saved.orders || [])
  const [coupon, setCoupon] = useState(saved.coupon || null)
  const [addresses, setAddresses] = useState(saved.addresses || [])
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ user, users, cart, wishlist, orders, coupon, addresses })
    )
  }, [user, users, cart, wishlist, orders, coupon, addresses])

  const toast = (message, type = 'ok') => {
    const id = uid('t')
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }

  const register = ({ name, email, password, phone }) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const next = { id: uid('u'), name, email, password, phone, joined: new Date().toISOString() }
    setUsers((list) => [...list, next])
    setUser({ id: next.id, name, email, phone })
    toast(`Welcome to Trendora, ${name.split(' ')[0]}!`)
    return { ok: true }
  }

  const login = ({ email, password }) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { ok: false, error: 'Invalid email or password.' }
    setUser({ id: found.id, name: found.name, email: found.email, phone: found.phone })
    toast(`Welcome back, ${found.name.split(' ')[0]}`)
    return { ok: true }
  }

  const loginDemo = () => {
    const demo = users.find((u) => u.email === 'demo@trendora.in') || {
      id: 'u-demo',
      name: 'Aisha Verma',
      email: 'demo@trendora.in',
      password: 'demo123',
      phone: '9876543210',
      joined: new Date().toISOString(),
    }
    if (!users.some((u) => u.email === demo.email)) setUsers((list) => [...list, demo])
    setUser({ id: demo.id, name: demo.name, email: demo.email, phone: demo.phone })
    toast('Signed in as demo shopper')
    return { ok: true }
  }

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

  const addToCart = (productId, { color, size, qty = 1 } = {}) => {
    const product = getProduct(productId)
    if (!product) return
    setCart((items) => {
      const i = items.findIndex(
        (x) => x.id === productId && x.color === (color || product.colors[0]) && x.size === (size || product.sizes[0])
      )
      if (i >= 0) {
        const copy = [...items]
        copy[i] = { ...copy[i], qty: Math.min(copy[i].qty + qty, product.stock) }
        return copy
      }
      return [
        ...items,
        {
          id: productId,
          color: color || product.colors[0],
          size: size || product.sizes[0],
          qty,
        },
      ]
    })
    toast('Added to bag')
  }

  const updateQty = (index, qty) => {
    setCart((items) => {
      const copy = [...items]
      const product = getProduct(copy[index].id)
      const next = Math.max(1, Math.min(qty, product?.stock || 1))
      copy[index] = { ...copy[index], qty: next }
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
    const found = COUPONS[key]
    if (!found) return { ok: false, error: 'This coupon is not valid.' }
    setCoupon({ code: key, ...found })
    toast(`Coupon ${key} applied`)
    return { ok: true }
  }

  const clearCoupon = () => setCoupon(null)

  const saveAddress = (address) => {
    const next = { id: uid('a'), ...address }
    setAddresses((list) => [...list, next])
    return next
  }

  const cartDetailed = useMemo(
    () =>
      cart
        .map((line) => {
          const product = getProduct(line.id)
          if (!product) return null
          return { ...line, product, lineTotal: product.price * line.qty }
        })
        .filter(Boolean),
    [cart]
  )

  const totals = useMemo(() => {
    const subtotal = cartDetailed.reduce((s, l) => s + l.lineTotal, 0)
    const mrpTotal = cartDetailed.reduce((s, l) => s + l.product.mrp * l.qty, 0)
    const productSave = mrpTotal - subtotal
    let discount = 0
    let shipping = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 79
    if (coupon) {
      if (coupon.type === 'percent' && subtotal >= coupon.min) {
        discount = Math.round((subtotal * coupon.value) / 100)
      } else if (coupon.type === 'flat' && subtotal >= coupon.min) {
        discount = coupon.value
      } else if (coupon.type === 'shipping') {
        shipping = 0
      }
    }
    const grand = Math.max(0, subtotal - discount + shipping)
    return { subtotal, mrpTotal, productSave, discount, shipping, grand, count: cartDetailed.reduce((s, l) => s + l.qty, 0) }
  }, [cartDetailed, coupon])

  const placeOrder = ({ address, payment }) => {
    if (!cartDetailed.length) return { ok: false, error: 'Your bag is empty.' }
    const order = {
      id: `TRD${Date.now().toString().slice(-8)}`,
      placedAt: new Date().toISOString(),
      items: cartDetailed.map((l) => ({
        id: l.id,
        name: l.product.name,
        brand: l.product.brand,
        image: l.product.image,
        price: l.product.price,
        qty: l.qty,
        color: l.color,
        size: l.size,
      })),
      totals,
      coupon,
      address,
      payment,
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
    setCart([])
    setCoupon(null)
    toast(`Order ${order.id} placed`)
    return { ok: true, order }
  }

  const value = {
    user,
    users,
    cart,
    cartDetailed,
    wishlist,
    orders,
    coupon,
    addresses,
    toasts,
    totals,
    toast,
    register,
    login,
    loginDemo,
    logout,
    updateProfile,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    applyCoupon,
    clearCoupon,
    saveAddress,
    placeOrder,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
