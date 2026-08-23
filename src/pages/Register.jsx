import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ROLE_META } from '../data/products'
import { useStore } from '../context/StoreContext'

export default function Register() {
  const { register, user } = useStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'customer', shopName: '' })
  const [err, setErr] = useState('')
  const navigate = useNavigate()
  if (user) return <Navigate to={ROLE_META[user.role]?.home || '/'} replace />

  const submit = (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      setErr('Password should be at least 6 characters.')
      return
    }
    const res = register(form)
    if (!res.ok) setErr(res.error)
    else navigate(ROLE_META[res.role]?.home || '/')
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
            <option value="seller">Seller — list like Meesho</option>
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
        {form.role === 'seller' && (
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
