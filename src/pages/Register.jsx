import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ROLE_META } from '../data/products'
import { useStore } from '../context/StoreContext'

export default function Register() {
  const { register, user } = useStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'customer', shopName: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  if (user) return <Navigate to={ROLE_META[user.role]?.home || '/'} replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const res = await register(form)
      if (!res.ok) setErr(res.error)
      else navigate(ROLE_META[res.role]?.home || '/')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="wrap">
      <form className="auth-wrap" onSubmit={submit}>
        <div className="eyebrow">Join Trendora</div>
        <h1>Create account</h1>
        <div className="field">
          <label>I am a</label>
          <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            <option value="customer">Customer — shop like Myntra</option>
            <option value="reseller">Reseller — share like Meesho, no stock</option>
            <option value="seller">Seller / supplier — list catalogue</option>
          </select>
        </div>
        {[
          ['name', 'Full name', 'text'],
          ['email', 'Email', 'email'],
          ['phone', 'Mobile', 'tel'],
          ['password', 'Password', 'password'],
        ].map(([k, label, type]) => (
          <div className="field" key={k}>
            <label>{label}</label>
            <input type={type} value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} required />
          </div>
        ))}
        {(form.role === 'seller' || form.role === 'reseller') && (
          <div className="field">
            <label>Shop name</label>
            <input value={form.shopName} onChange={(e) => setForm((f) => ({ ...f, shopName: e.target.value }))} />
          </div>
        )}
        {err && <div className="error">{err}</div>}
        <button className="btn btn-primary btn-block" type="submit">
          Register
        </button>
        <p className="hint">
          Admin / Owner logins are created by the owner. Demo: <Link to="/login">role cards</Link>
        </p>
      </form>
    </div>
  )
}
