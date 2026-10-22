import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'
import { Icon } from '../components/Icons'
import ProductImage from '../components/ProductImage'

export default function OrderDetail() {
  const { id } = useParams()
  const { orders, cancelOrder, requestReturn, user } = useStore()
  const [reason, setReason] = useState('Size / fit issue')
  const [kind, setKind] = useState('Return')
  const { state } = useLocation()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="empty">
        <h2>Order not found</h2>
        <Link className="btn btn-primary" to="/orders">
          All orders
        </Link>
      </div>
    )
  }

  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      {state?.fresh && (
        <div className="success" style={{ marginBottom: 8 }}>
          <div className="mark">
            <Icon.check />
          </div>
          <h1>Order placed</h1>
          <p style={{ color: 'var(--muted)' }}>
            We&apos;ve packed this confirmation into your browser. Show this screen in your viva.
          </p>
        </div>
      )}
      <div className="page-hero">
        <h1>{order.id}</h1>
        <p style={{ color: 'var(--muted)' }}>
          {new Date(order.placedAt).toLocaleString('en-IN')} · {order.payment} · {order.status}
        </p>
      </div>
      <div className="timeline">
        {order.timeline.map((t) => (
          <div key={t.label} className={`tl ${t.done ? 'done' : ''}`}>
            {t.label}
          </div>
        ))}
      </div>
      <div className="cart-layout">
        <div>
          {order.items.map((item, i) => (
            <article key={i} className="cart-item">
              <ProductImage src={item.image} alt={item.name} />
              <div>
                <div className="pcard-brand">{item.brand}</div>
                <div className="pcard-name">{item.name}</div>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {item.color} · {item.size} · Qty {item.qty}
                </p>
              </div>
              <div className="price">{formatINR(item.price * item.qty)}</div>
            </article>
          ))}
        </div>
        <aside className="summary">
          <h3 className="serif" style={{ fontSize: 22 }}>
            Deliver to
          </h3>
          <p style={{ fontSize: 14, margin: '8px 0 16px' }}>
            {order.address.name}
            <br />
            {order.address.line1}
            <br />
            {order.address.city}, {order.address.state} {order.address.pin}
            <br />
            {order.address.phone}
          </p>
          <div className="row total">
            <span>Paid</span>
            <span>{formatINR(order.totals.grand)}</span>
          </div>
          {['Confirmed', 'Packed'].includes(order.status) && (
            <button
              className="btn btn-outline btn-block"
              style={{ marginTop: 12 }}
              type="button"
              onClick={() => {
                if (window.confirm('Cancel this order and restore stock?')) cancelOrder(order.id)
              }}
            >
              Cancel order
            </button>
          )}
          {order.status === 'Delivered' && user && (
            <form
              style={{ marginTop: 16 }}
              onSubmit={(e) => {
                e.preventDefault()
                const res = requestReturn({ orderId: order.id, reason, itemId: order.items[0]?.id, kind })
                if (!res.ok) window.alert(res.error)
              }}
            >
              <div className="field">
                <label>Return or exchange</label>
                <select value={kind} onChange={(e) => setKind(e.target.value)}>
                  <option>Return</option>
                  <option>Exchange</option>
                </select>
              </div>
              <div className="field">
                <label>Reason</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)}>
                  <option>Size / fit issue</option>
                  <option>Damaged or defective</option>
                  <option>Wrong item</option>
                  <option>Changed mind</option>
                </select>
              </div>
              <button className="btn btn-ghost btn-block" type="submit">
                Request {kind.toLowerCase()}
              </button>
            </form>
          )}
          <Link className="btn btn-ghost btn-block" to="/orders" style={{ marginTop: 12 }}>
            All orders
          </Link>
        </aside>
      </div>
    </div>
  )
}
