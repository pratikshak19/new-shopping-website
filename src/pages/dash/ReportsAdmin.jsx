import { formatINR } from '../../data/products'
import { useStore } from '../../context/StoreContext'

export default function ReportsAdmin() {
  const { orders, products, users, settings } = useStore()
  const paid = orders.filter((o) => !['Cancelled'].includes(o.status))
  const gmv = paid.reduce((s, o) => s + o.totals.grand, 0)
  const byCat = {}
  paid.forEach((o) =>
    o.items.forEach((i) => {
      const p = products.find((x) => x.id === i.id)
      const c = p?.category || 'other'
      byCat[c] = (byCat[c] || 0) + i.price * i.qty
    })
  )
  return (
    <div>
      <h1 className="serif" style={{ fontSize: 30 }}>
        Owner reports
      </h1>
      <div className="stat-grid">
        <article className="stat">
          <span>GMV</span>
          <b>{formatINR(gmv)}</b>
        </article>
        <article className="stat">
          <span>Orders</span>
          <b>{orders.length}</b>
        </article>
        <article className="stat">
          <span>AOV</span>
          <b>{formatINR(paid.length ? gmv / paid.length : 0)}</b>
        </article>
        <article className="stat">
          <span>Take rate</span>
          <b>{settings.commission}%</b>
        </article>
      </div>
      <h3>GMV by category</h3>
      <ul className="plain-list">
        {Object.entries(byCat).map(([c, n]) => (
          <li key={c}>
            {c} — {formatINR(n)}
          </li>
        ))}
        {Object.keys(byCat).length === 0 && <li>Place a customer order to populate this chart.</li>}
      </ul>
      <h3>Users by role</h3>
      <ul className="plain-list">
        {['owner', 'admin', 'seller', 'customer'].map((r) => (
          <li key={r}>
            {r}: {users.filter((u) => u.role === r).length}
          </li>
        ))}
      </ul>
    </div>
  )
}
