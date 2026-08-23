import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ROLE_META } from '../data/products'
import { useStore } from '../context/StoreContext'

const DEMOS = [
  { email: 'demo@trendora.in', role: 'customer', hint: 'demo123' },
  { email: 'reseller@trendora.in', role: 'reseller', hint: 'reseller123' },
  { email: 'seller@trendora.in', role: 'seller', hint: 'seller123' },
  { email: 'admin@trendora.in', role: 'admin', hint: 'admin123' },
  { email: 'owner@trendora.in', role: 'owner', hint: 'owner123' },
]

export default function Login() {
  const { login, loginAs, user } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  if (user) return <Navigate to={ROLE_META[user.role]?.home || '/'} replace />

  const go = (role) => navigate(ROLE_META[role]?.home || '/')

  const submit = (e) => {
    e.preventDefault()
    const res = login({ email, password })
    if (!res.ok) setErr(res.error)
    else go(res.role)
  }

  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Sign in by authority</h1>
        <p style={{ color: 'var(--muted)' }}>Four separate logins — customer, seller, admin, owner — like Meesho + Myntra back-office.</p>
      </div>
      <div className="role-grid">
        {DEMOS.map((d) => (
          <button
            key={d.role}
            className="role-card"
            onClick={() => {
              const res = loginAs(d.email)
              if (!res.ok) setErr(res.error)
              else go(res.role)
            }}
          >
            <span className="role-pill" style={{ background: ROLE_META[d.role].color }}>
              {ROLE_META[d.role].label}
            </span>
            <strong>{d.email}</strong>
            <span className="muted">password {d.hint}</span>
            <em>Enter {ROLE_META[d.role].label} console</em>
          </button>
        ))}
      </div>
      <form className="auth-wrap" onSubmit={submit} style={{ marginTop: 8 }}>
        <div className="eyebrow">Or type credentials</div>
        <h2 className="serif" style={{ fontSize: 28 }}>Welcome back</h2>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {err && <div className="error">{err}</div>}
        <button className="btn btn-primary btn-block" type="submit">
          Sign in
        </button>
        <p className="hint">
          New customer or seller? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  )
}
