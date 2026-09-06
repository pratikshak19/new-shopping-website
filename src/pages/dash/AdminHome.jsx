import { Link } from 'react-router-dom'
import { formatINR } from '../../data/products'
import { useStore } from '../../context/StoreContext'

export default function AdminHome() {
  const { orders, products, users, returns, tickets } = useStore()
  const live = products.filter((p) => p.status !== 'hidden')
  const gmv = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + (o.totals?.grand || 0), 0)
  const actions = [
    ['Add a new item', 'Name, price, photo, stock — then it appears on Shop.', '/admin/add', 'btn-primary'],
    ['Full catalogue', 'Edit or hide any product already listed.', '/admin/products', 'btn-dark'],
    ['Orders desk', 'Confirmed → Packed → Shipped → Delivered.', '/admin/orders', 'btn-ghost'],
    ['Returns', 'Approve customer return / exchange requests.', '/admin/returns', 'btn-ghost'],
    ['Coupons', 'TREND10, FESTIVE20 or make your own code.', '/admin/coupons', 'btn-ghost'],
    ['Customers', 'See customer accounts. Admin is the only staff login.', '/admin/users', 'btn-ghost'],
  ]
  return (
    <div>
      <p className="eyebrow">Separate admin console</p>
      <h1 className="serif" style={{ fontSize: 34, marginBottom: 8 }}>
        Admin desk
      </h1>
      <p className="muted" style={{ maxWidth: 640, marginBottom: 22 }}>
        This page is separate from the shop. Customers cannot open it.
        Use the first pink button to add a new product.
      </p>
      <div className="stat-grid">
        {[
          ['Live SKUs', live.length],
          ['Orders', orders.length],
          ['GMV', formatINR(gmv)],
          ['Open tickets', tickets.filter((t) => t.status === 'Open').length],
        ].map(([k, v]) => (
          <article key={k} className="stat">
            <span>{k}</span>
            <b>{v}</b>
          </article>
        ))}
      </div>
      <div className="admin-actions">
        {actions.map(([title, text, to, cls]) => (
          <Link key={to} to={to} className="admin-card">
            <h3 className="serif">{title}</h3>
            <p>{text}</p>
            <span className={`btn ${cls}`} style={{ marginTop: 12 }}>
              Open
            </span>
          </Link>
        ))}
      </div>
      <p className="muted" style={{ marginTop: 18 }}>
        Returns waiting: {returns.filter((r) => r.status === 'Requested').length} · People on file: {users.length}
      </p>
    </div>
  )
}
