import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'
import ProductImage from '../components/ProductImage'
import { Icon } from '../components/Icons'

export default function Cart() {
  const { cartDetailed, totals, updateQty, removeFromCart, applyCoupon, coupon, clearCoupon } = useStore()
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')

  const apply = (e) => {
    e.preventDefault()
    const res = applyCoupon(code)
    setErr(res.ok ? '' : res.error)
  }

  if (!cartDetailed.length) {
    return (
      <div className="empty">
        <h2>Your bag is empty</h2>
        <p>Looks like you haven&apos;t added anything yet.</p>
        <Link className="btn btn-primary" to="/shop" style={{ marginTop: 16 }}>
          Start shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="wrap">
      <div className="page-hero">
        <h1>Your bag</h1>
        <p style={{ color: 'var(--muted)' }}>{totals.count} item{totals.count > 1 ? 's' : ''}</p>
      </div>
      <div className="cart-layout">
        <div>
          {cartDetailed.map((line, i) => (
            <article key={`${line.id}-${line.color}-${line.size}-${i}`} className="cart-item">
              <Link to={`/product/${line.id}`}>
                <ProductImage src={line.product.image} alt={line.product.name} />
              </Link>
              <div>
                <div className="pcard-brand">{line.product.brand}</div>
                <Link to={`/product/${line.id}`} className="pcard-name">
                  {line.product.name}
                </Link>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 10px' }}>
                  {line.color} · {line.size}
                </p>
                <div className="qty">
                  <button onClick={() => updateQty(i, line.qty - 1)}>-</button>
                  <span>{line.qty}</span>
                  <button onClick={() => updateQty(i, line.qty + 1)}>+</button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="price">{formatINR(line.lineTotal)}</div>
                <button onClick={() => removeFromCart(i)} style={{ marginTop: 12, color: 'var(--muted)' }} aria-label="Remove">
                  <Icon.trash style={{ width: 18, height: 18 }} />
                </button>
              </div>
            </article>
          ))}
        </div>
        <aside className="summary">
          <h3 className="serif" style={{ fontSize: 24, marginBottom: 8 }}>
            Price details
          </h3>
          <div className="row">
            <span>MRP</span>
            <span>{formatINR(totals.mrpTotal)}</span>
          </div>
          <div className="row">
            <span>Product discount</span>
            <span style={{ color: 'var(--ok)' }}>-{formatINR(totals.productSave)}</span>
          </div>
          <div className="row">
            <span>Coupon</span>
            <span style={{ color: 'var(--ok)' }}>-{formatINR(totals.discount)}</span>
          </div>
          <div className="row">
            <span>Delivery</span>
            <span>{totals.shipping === 0 ? 'Free' : formatINR(totals.shipping)}</span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span>{formatINR(totals.grand)}</span>
          </div>
          <form className="coupon" onSubmit={apply}>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" />
            <button className="btn btn-ghost" type="submit">
              Apply
            </button>
          </form>
          {err && <div className="error">{err}</div>}
          {coupon && (
            <p style={{ fontSize: 13, color: 'var(--ok)' }}>
              {coupon.code} · {coupon.label}{' '}
              <button onClick={clearCoupon} style={{ textDecoration: 'underline' }}>
                remove
              </button>
            </p>
          )}
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '8px 0 14px' }}>
            Try TREND10, FESTIVE20, WELCOME100 or FREESHIP
          </p>
          <Link className="btn btn-primary btn-block" to="/checkout">
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  )
}
