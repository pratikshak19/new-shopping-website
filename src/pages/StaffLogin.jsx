import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ROLE_META } from '../data/products'
import { useStore } from '../context/StoreContext'

export default function StaffLogin() {
  const { login, loginAs, user } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  if (user) return <Navigate to="/" replace />

  const go = () => navigate('/admin')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const res = await login({ email, password, staff: true })
      if (!res.ok) setErr(res.error)
      else if (res.role !== 'admin') setErr('This door is only for the store admin.')
      else go()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="wrap">
      <form className="auth-wrap" onSubmit={submit}>
        <div className="eyebrow">Private</div>
        <h1>Admin desk</h1>
        <p className="muted">
          Trendora has two accounts only: customer (public shop) and admin (this desk). Owner, seller and reseller
          logins are not part of the project.
        </p>
        <button
          type="button"
          className="role-card"
          onClick={() => {
            const res = loginAs('admin@trendora.in')
            if (!res.ok) setErr(res.error)
            else go()
          }}
        >
          <span className="role-pill" style={{ background: ROLE_META.admin.color }}>
            Admin
          </span>
          <strong>admin@trendora.in</strong>
          <span className="muted">password admin123</span>
        </button>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {err && <div className="error">{err}</div>}
        <button className="btn btn-dark btn-block" type="submit" disabled={busy}>
          Enter admin
        </button>
      </form>
    </div>
  )
}
