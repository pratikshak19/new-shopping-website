import { Link, NavLink, useLocation } from 'react-router-dom'
import { ROLE_META } from '../data/products'
import { useStore } from '../context/StoreContext'

const LINKS = {
  seller: [
    ['Overview', ''],
    ['My catalogue', '/products'],
    ['Orders', '/orders'],
    ['Earnings', '/earnings'],
    ['Support tickets', '/tickets'],
  ],
  admin: [
    ['Overview', ''],
    ['Catalogue', '/products'],
    ['Orders', '/orders'],
    ['Returns', '/returns'],
    ['Customers & staff', '/users'],
    ['Coupons', '/coupons'],
    ['Tickets', '/tickets'],
  ],
  owner: [
    ['Overview', ''],
    ['Catalogue', '/products'],
    ['Orders', '/orders'],
    ['Returns', '/returns'],
    ['People & roles', '/users'],
    ['Coupons', '/coupons'],
    ['Tickets', '/tickets'],
    ['Reports', '/reports'],
    ['Store settings', '/settings'],
  ],
}

export default function DashLayout({ role, children }) {
  const { user, logout } = useStore()
  const base = `/${role}`
  const loc = useLocation()
  const meta = ROLE_META[role]
  return (
    <div className="dash">
      <aside className="dash-side">
        <div className="dash-role" style={{ borderColor: meta.color }}>
          {meta.label} console
        </div>
        <strong>{user?.name}</strong>
        <p className="muted">{user?.email}</p>
        <nav>
          {LINKS[role].map(([label, path]) => {
            const to = `${base}${path}`
            const active = path === '' ? loc.pathname === base : loc.pathname.startsWith(to)
            return (
              <NavLink key={to} to={to} end={path === ''} className={active ? 'on' : ''}>
                {label}
              </NavLink>
            )
          })}
        </nav>
        <Link to="/" className="btn btn-ghost" style={{ marginTop: 16 }}>
          View store
        </Link>
        <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={logout}>
          Sign out
        </button>
      </aside>
      <section className="dash-main">{children}</section>
    </div>
  )
}
