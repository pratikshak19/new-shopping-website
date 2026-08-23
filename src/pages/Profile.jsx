import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ROLE_META } from '../data/products'
import { useStore } from '../context/StoreContext'

export default function Profile() {
  const { user, updateProfile, logout, orders, wishlist, tier } = useStore()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  if (!user) return <Navigate to="/login" replace />
  const portal = ROLE_META[user.role].home

  return (
    <div className="wrap">
      <div className="page-hero">
        <h1>Hi, {user.name.split(' ')[0]}</h1>
        <p style={{ color: 'var(--muted)' }}>
          {user.email} · <span className="role-pill" style={{ background: ROLE_META[user.role].color }}>{user.role}</span>
          {' '}· Insider {tier.name} · {user.points || 0} pts
        </p>
      </div>
      <div className="profile-grid">
        <aside className="side">
          <Link className="active" to="/profile">Profile</Link>
          {portal !== '/' && <Link to={portal}>{ROLE_META[user.role].label} console</Link>}
          <Link to="/orders">Orders ({orders.filter((o) => o.userId === user.id).length})</Link>
          <Link to="/returns">Returns</Link>
          <Link to="/addresses">Addresses</Link>
          <Link to="/wishlist">Wishlist ({wishlist.length})</Link>
          <Link to="/insider">Insider</Link>
          <Link to="/notifications">Notifications</Link>
          <Link to="/documents">Project documents</Link>
          <button onClick={logout} style={{ padding: '10px 12px', color: 'var(--rose)', fontWeight: 600 }}>
            Sign out
          </button>
        </aside>
        <form
          className="summary"
          style={{ position: 'static' }}
          onSubmit={(e) => {
            e.preventDefault()
            updateProfile(form)
          }}
        >
          <h3 className="serif" style={{ fontSize: 24 }}>Account details</h3>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="field">
            <label>Mobile</label>
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={user.email} disabled />
          </div>
          <button className="btn btn-primary" type="submit">Save changes</button>
        </form>
      </div>
    </div>
  )
}
