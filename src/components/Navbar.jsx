import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/products'
import { useStore } from '../context/StoreContext'
import { Icon } from './Icons'

export default function Navbar() {
  const { totals, wishlist, user } = useStore()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const go = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop')
    setOpen(false)
  }

  return (
    <>
      <div className="announce">
        Festive edit is live · Use <strong>FESTIVE20</strong> for 20% off · Free delivery above ₹999
      </div>
      <header className="nav">
        <div className="wrap nav-row">
          <button className="icon-btn menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <Icon.menu />
          </button>
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <img src="/images/logo.png" alt="Trendora" />
            <div className="brand-name">Tren<span>dora</span></div>
          </Link>
          <nav className="nav-links">
            <NavLink to="/shop">Shop</NavLink>
            {CATEGORIES.slice(0, 5).map((c) => (
              <NavLink key={c.id} to={`/shop?cat=${c.id}`}>
                {c.name}
              </NavLink>
            ))}
          </nav>
          <form className="search" onSubmit={go}>
            <Icon.search />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for kurtas, sneakers, earbuds..."
            />
          </form>
          <div className="nav-acts">
            <Link to={user ? '/profile' : '/login'} className="icon-btn" title={user ? user.name : 'Account'}>
              <Icon.user />
            </Link>
            <Link to="/wishlist" className="icon-btn" title="Wishlist">
              <Icon.heart />
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="icon-btn" title="Bag">
              <Icon.bag />
              {totals.count > 0 && <span className="badge">{totals.count}</span>}
            </Link>
          </div>
        </div>
        <div className={`mobile-drawer wrap ${open ? 'open' : ''}`}>
          <form className="search" onSubmit={go} style={{ marginBottom: 10 }}>
            <Icon.search />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Trendora"
            />
          </form>
          <Link to="/shop" onClick={() => setOpen(false)}>All products</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/shop?cat=${c.id}`} onClick={() => setOpen(false)}>
              {c.name}
            </Link>
          ))}
          <Link to="/orders" onClick={() => setOpen(false)}>My orders</Link>
        </div>
      </header>
    </>
  )
}
