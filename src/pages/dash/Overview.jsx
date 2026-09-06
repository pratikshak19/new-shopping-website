import { Link } from 'react-router-dom'
import { formatINR } from '../../data/products'
import { useStore } from '../../context/StoreContext'

export default function Overview({ role }) {
  const { orders, products, users, returns, tickets, settings, user } = useStore()
  const sellerId = user?.id
  const catalog = role === 'seller' ? products.filter((p) => p.sellerId === sellerId) : products.filter((p) => p.status !== 'hidden')
  const relevantOrders =
    role === 'seller'
      ? orders.filter((o) => o.items.some((i) => i.sellerId === sellerId))
      : orders
  const gmv = relevantOrders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + (o.totals?.grand || 0), 0)
  const cards = [
    ['Orders', relevantOrders.length],
    ['Catalogue', catalog.length],
    ['GMV', formatINR(gmv)],
    role === 'seller' ? ['Commission', `${settings.commission}%`] : ['People', users.length],
  ]
  return (
    <div>
      <h1 className="serif" style={{ fontSize: 32, marginBottom: 8 }}>
        {role === 'owner' ? 'Owner command centre' : role === 'admin' ? 'Admin desk' : 'Seller studio'}
      </h1>
      <p className="muted" style={{ marginBottom: 20 }}>
        Same nouns as Meesho supplier panel + Myntra admin: catalogue, orders, returns, offers.
      </p>
      <div className="stat-grid">
        {cards.map(([k, v]) => (
          <article key={k} className="stat">
            <span>{k}</span>
            <b>{v}</b>
          </article>
        ))}
      </div>
      <div className="table-wrap">
        <h3>Latest orders</h3>
        <table className="grid-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {relevantOrders.slice(0, 6).map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.status}</td>
                <td>{o.items.length}</td>
                <td>{formatINR(o.totals.grand)}</td>
              </tr>
            ))}
            {relevantOrders.length === 0 && (
              <tr>
                <td colSpan={4}>No orders yet — place one as the customer demo.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 16 }}>
        Open tickets: {tickets.filter((t) => t.status === 'Open').length} · Returns: {returns.length} ·{' '}
        <Link to={`/${role}/orders`}>Manage orders →</Link>
      </p>
    </div>
  )
}
