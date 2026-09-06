import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ROLE_META } from '../data/products'
import { useStore } from '../context/StoreContext'

export default function Login() {
  const { login, confirmLoginOtp, resendOtp, user } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [otpGate, setOtpGate] = useState(null)
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')
  const after = next && next.startsWith('/') && !next.startsWith('//') ? next : ''

  if (user) {
    const to = user.role === 'customer' ? after || '/' : ROLE_META[user.role]?.home || '/'
    return <Navigate to={to} replace />
  }

  const go = (role) => navigate(role === 'customer' ? after || '/' : ROLE_META[role]?.home || '/')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const res = await login({ email, password })
      if (!res.ok) setErr(res.error)
      else if (res.needsOtp) setOtpGate(res)
      else go(res.role)
    } finally {
      setBusy(false)
    }
  }

  const verify = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const res = confirmLoginOtp({ email: otpGate.email, code: otp, pendingNew: otpGate.pendingNew })
      if (!res.ok) setErr(res.error)
      else go(res.role)
    } finally {
      setBusy(false)
    }
  }

  if (otpGate) {
    return (
      <div className="wrap">
        <form className="auth-wrap" onSubmit={verify}>
          <div className="eyebrow">Step 2 of 2</div>
          <h1>Enter OTP</h1>
          <p className="muted">Password accepted. Enter OTP <strong>1923</strong> for every customer. No real SMS is sent.</p>
          <div className="otp-demo">
            Customer OTP: <strong>1923</strong>
          </div>
          <div className="field">
            <label>OTP</label>
            <input inputMode="numeric" maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          {err && <div className="error">{err}</div>}
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? 'Checking…' : 'Verify & shop'}
          </button>
          <button
            type="button"
            className="linkish"
            style={{ marginTop: 12 }}
            onClick={() => {
              const r = resendOtp({ email: otpGate.email, purpose: 'login' })
              setOtpGate((g) => ({ ...g, demoCode: r.demoCode }))
              setOtp('')
            }}
          >
            Resend OTP
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="wrap">
      <form className="auth-wrap" onSubmit={submit}>
        <div className="eyebrow">Customer sign in</div>
        <h1>Welcome back</h1>
        <p className="muted">
          Any customer email works. New emails create an account after OTP. Admin uses /staff. OTP for every customer is 1923.
        </p>
        <div className="field">
          <label>Email</label>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {err && <div className="error">{err}</div>}
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="hint">
          New here? <Link to={after ? `/register?next=${encodeURIComponent(after)}` : '/register'}>Create a customer account</Link>
        </p>
        <p className="hint" style={{ fontSize: 12 }}>
          Demo: demo@trendora.in / demo123 · OTP 1923. Any other email + password (6+ letters) also works.
        </p>
      </form>
    </div>
  )
}
