import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Register() {
  const { beginRegister, finishRegister, resendOtp, user } = useStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [otp, setOtp] = useState('')
  const [pending, setPending] = useState(null)
  const [demoCode, setDemoCode] = useState('')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')
  const after = next && next.startsWith('/') && !next.startsWith('//') ? next : '/'
  if (user) return <Navigate to={after} replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const res = await beginRegister({ ...form, role: 'customer' })
      if (!res.ok) setErr(res.error)
      else {
        setPending(res.pending)
        setDemoCode(res.demoCode)
      }
    } finally {
      setBusy(false)
    }
  }

  const verify = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const res = await finishRegister({ pending, code: otp })
      if (!res.ok) setErr(res.error)
      else navigate(after)
    } finally {
      setBusy(false)
    }
  }

  if (pending) {
    return (
      <div className="wrap">
        <form className="auth-wrap" onSubmit={verify}>
          <div className="eyebrow">Step 2 of 2</div>
          <h1>Verify mobile</h1>
          <p className="muted">Customer account — OTP for every new account is <strong>1923</strong> (simulated, no real SMS).</p>
          <div className="otp-demo">
            Customer OTP: <strong>1923</strong>
          </div>
          <div className="field">
            <label>OTP</label>
            <input inputMode="numeric" maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          {err && <div className="error">{err}</div>}
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? 'Checking…' : 'Verify & create account'}
          </button>
          <button
            type="button"
            className="linkish"
            style={{ marginTop: 12 }}
            onClick={() => {
              const r = resendOtp({ email: pending.email, phone: pending.phone, purpose: 'register' })
              setDemoCode(r.demoCode)
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
        <div className="eyebrow">Join Trendora</div>
        <h1>Create customer account</h1>
        <p className="muted">Public sign-up is for shopping only. You cannot add or delete catalogue items.</p>
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
        {err && <div className="error">{err}</div>}
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
          {busy ? 'Please wait…' : 'Send OTP'}
        </button>
        <p className="hint">
          Already shop here? <Link to={after !== '/' ? `/login?next=${encodeURIComponent(after)}` : '/login'}>Sign in</Link>
        </p>
      </form>
    </div>
  )
}
