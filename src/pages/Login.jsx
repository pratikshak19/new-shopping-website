import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Login() {
  const { login, loginDemo, user } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  if (user) return <Navigate to="/profile" replace />

  const submit = (e) => {
    e.preventDefault()
    const res = login({ email, password })
    if (!res.ok) setErr(res.error)
    else navigate('/')
  }

  return (
    <div className="wrap">
      <form className="auth-wrap" onSubmit={submit}>
        <div className="eyebrow">Account</div>
        <h1>Welcome back</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 12 }}>Sign in to track orders and speed through checkout.</p>
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
        <button
          className="btn btn-ghost btn-block"
          type="button"
          style={{ marginTop: 8 }}
          onClick={() => {
            loginDemo()
            navigate('/')
          }}
        >
          Use demo account
        </button>
        <p className="hint">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  )
}
