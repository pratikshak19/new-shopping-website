import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toasts from './components/Toasts'
import Seo from './components/Seo'
import RequireRole from './components/RequireRole'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'
import Offers from './pages/Offers'
import Brands from './pages/Brands'
import Studio from './pages/Studio'
import Insider from './pages/Insider'
import Compare from './pages/Compare'
import Help from './pages/Help'
import Notifications from './pages/Notifications'
import Addresses from './pages/Addresses'
import MyReturns from './pages/MyReturns'
import Documents from './pages/Documents'
import Reseller from './pages/Reseller'
import Portal from './pages/dash/Portal'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const staff = /^\/(owner|admin|seller)(\/|$)/.test(pathname)
  return (
    <div className="app-shell">
      <Seo />
      <a className="skip" href="#main">Skip to content</a>
      <ScrollTop />
      {!staff && <Navbar />}
      <main className="page" id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/returns" element={<MyReturns />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/insider" element={<Insider />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/help" element={<Help />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/documents" element={<Documents />} />
          <Route
            path="/reseller"
            element={
              <RequireRole roles={['reseller', 'owner']}>
                <Reseller />
              </RequireRole>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/owner/*"
            element={
              <RequireRole roles={['owner']}>
                <Portal role="owner" />
              </RequireRole>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RequireRole roles={['admin', 'owner']}>
                <Portal role="admin" />
              </RequireRole>
            }
          />
          <Route
            path="/seller/*"
            element={
              <RequireRole roles={['seller', 'owner']}>
                <Portal role="seller" />
              </RequireRole>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!staff && <Footer />}
      <Toasts />
    </div>
  )
}
