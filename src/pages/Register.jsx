import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Register() {
  const { register, user } = useStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [err, setErr] = useState('')
  const navigate = useNavigate()
  if (user) navigate('/profile')

  const submit = (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      setErr('Password should be at least 6 characters.')
      return
    }
    const res = register(form)
    if (!res.ok) setErr(res.error)
    else navigate('/')
  }

  return (
    <div className="wrap">
      <form className="auth-wrap" onSubmit={submit}>
        <div className="eyebrow">Join Trendora</div>
        <h1>Create account</h1>
        {[
          ['name', 'Full name', 'text'],
          ['email', 'Email', 'email'],
          ['phone', 'Mobile', 'tel'],
          ['password', 'Password', 'password'],
        ].map(([k, label, type]) => (
          <div className="field" key={k}>
            <label>{label}</label>
            <input
              type={type}
              value={form[k]}
              onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
              required
            />
          </div>
        ))}
        {err && <div className="error">{err}</div>}
        <button className="btn btn-primary btn-block" type="submit">
          Register
        </button>
        <p className="hint">
          Already a member? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
