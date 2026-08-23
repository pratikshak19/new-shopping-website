import { useState } from 'react'
import { useStore } from '../../context/StoreContext'

export default function CouponsAdmin() {
  const { coupons, saveCoupon } = useStore()
  const [form, setForm] = useState({ code: '', type: 'percent', value: 10, min: 499, label: '', active: true })
  return (
    <div>
      <h1 className="serif" style={{ fontSize: 30 }}>
        Coupons &amp; offers
      </h1>
      <form
        className="dash-form"
        onSubmit={(e) => {
          e.preventDefault()
          saveCoupon({ ...form, code: form.code.toUpperCase(), value: +form.value, min: +form.min })
          setForm({ code: '', type: 'percent', value: 10, min: 499, label: '', active: true })
        }}
      >
        <div className="split">
          <div className="field">
            <label>Code</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="percent">Percent</option>
              <option value="flat">Flat ₹</option>
              <option value="shipping">Free ship</option>
            </select>
          </div>
          <div className="field">
            <label>Value</label>
            <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <div className="field">
            <label>Min cart</label>
            <input type="number" value={form.min} onChange={(e) => setForm({ ...form, min: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Label</label>
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        </div>
        <button className="btn btn-primary" type="submit">
          Save coupon
        </button>
      </form>
      <ul className="plain-list">
        {coupons.map((c) => (
          <li key={c.code}>
            <strong>{c.code}</strong> — {c.label} ({c.type} {c.value}){' '}
            <button className="linkish" onClick={() => saveCoupon({ ...c, active: !c.active })}>
              {c.active ? 'Disable' : 'Enable'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
