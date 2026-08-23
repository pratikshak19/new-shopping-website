import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'
import { Icon } from '../components/Icons'

const empty = {
  name: '',
  phone: '',
  line1: '',
  city: '',
  state: '',
  pin: '',
}

export default function Checkout() {
  const { cartDetailed, totals, placeOrder, user, saveAddress, addresses, giftWrap, setGiftWrap } = useStore()
  const mine = addresses.filter((a) => a.userId === user?.id)
  const [address, setAddress] = useState({
    ...empty,
    name: user?.name || '',
    phone: user?.phone || '',
  })
  const [pay, setPay] = useState('upi')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  if (!cartDetailed.length) {
    return (
      <div className="empty">
        <h2>Nothing to checkout</h2>
        <Link className="btn btn-primary" to="/shop">
          Shop first
        </Link>
      </div>
    )
  }

  const set = (k) => (e) => setAddress((a) => ({ ...a, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (Object.values(address).some((v) => !String(v).trim())) {
      setErr('Please fill every address field.')
      return
    }
    if (!/^\d{6}$/.test(address.pin)) {
      setErr('Enter a valid 6-digit PIN code.')
      return
    }
    saveAddress(address)
    const methods = {
      upi: 'UPI (simulated)',
      card: 'Debit / Credit card (simulated)',
      cod: 'Cash on delivery',
    }
    const res = placeOrder({ address, payment: methods[pay] })
    if (!res.ok) {
      setErr(res.error)
      return
    }
    navigate(`/orders/${res.order.id}`, { state: { fresh: true } })
  }

  return (
    <div className="wrap">
      <div className="page-hero">
        <h1>Checkout</h1>
        <div className="steps">
          <div className="step on">Bag</div>
          <div className="step on">Address</div>
          <div className="step">Payment</div>
        </div>
      </div>
      <form className="cart-layout" onSubmit={submit}>
        <div>
          <div className="summary" style={{ position: 'static', marginBottom: 16 }}>
            <h3 className="serif" style={{ fontSize: 24, marginBottom: 8 }}>
              Delivery address
            </h3>
            {mine.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {mine.map((a) => (
                  <button type="button" key={a.id} className="pay-opt" onClick={() => setAddress({ ...a })}>
                    Use {a.line1}, {a.city} {a.pin}
                  </button>
                ))}
              </div>
            )}
            <div className="field">
              <label>Full name</label>
              <input value={address.name} onChange={set('name')} />
            </div>
            <div className="field">
              <label>Mobile</label>
              <input value={address.phone} onChange={set('phone')} />
            </div>
            <div className="field">
              <label>Address line</label>
              <input value={address.line1} onChange={set('line1')} placeholder="House no, street, landmark" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="field">
                <label>City</label>
                <input value={address.city} onChange={set('city')} />
              </div>
              <div className="field">
                <label>State</label>
                <input value={address.state} onChange={set('state')} />
              </div>
            </div>
            <div className="field">
              <label>PIN code</label>
              <input value={address.pin} onChange={set('pin')} maxLength={6} />
            </div>
          </div>
          <div className="summary" style={{ position: 'static' }}>
            <h3 className="serif" style={{ fontSize: 24, marginBottom: 8 }}>
              Payment
            </h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
              This is a college project. No real money is collected.
            </p>
            {[
              ['upi', 'UPI — GPay / PhonePe / Paytm'],
              ['card', 'Credit or debit card'],
              ['cod', 'Cash on delivery'],
            ].map(([id, label]) => (
              <button type="button" key={id} className={`pay-opt ${pay === id ? 'on' : ''}`} onClick={() => setPay(id)}>
                <input type="radio" checked={pay === id} readOnly /> {label}
              </button>
            ))}
          </div>
        </div>
        <aside className="summary">
          <h3 className="serif" style={{ fontSize: 22 }}>
            {cartDetailed.length} item{cartDetailed.length > 1 ? 's' : ''}
          </h3>
          {cartDetailed.map((l, i) => (
            <div className="row" key={i}>
              <span>
                {l.product.name.slice(0, 28)} × {l.qty}
              </span>
              <span>{formatINR(l.lineTotal)}</span>
            </div>
          ))}
          <div className="row">
            <span>Delivery</span>
            <span>{totals.shipping ? formatINR(totals.shipping) : 'Free'}</span>
          </div>
          <div className="row">
            <span>Coupon</span>
            <span>-{formatINR(totals.discount)}</span>
          </div>
          <div className="row total">
            <span>To pay</span>
            <span>{formatINR(totals.grand)}</span>
          </div>
          {err && <div className="error">{err}</div>}
          <button className="btn btn-primary btn-block" type="submit" style={{ marginTop: 12 }}>
            Place order
          </button>
        </aside>
      </form>
    </div>
  )
}
