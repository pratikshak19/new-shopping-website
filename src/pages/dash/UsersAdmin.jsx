import { useState } from 'react'
import { ROLE_META } from '../../data/products'
import { useStore } from '../../context/StoreContext'

export default function UsersAdmin({ role }) {
  const { users, createStaff, setUserBlocked, setUserRole } = useStore()
  const [form, setForm] = useState({ name: '', email: '', password: 'pass123', phone: '', role: 'admin', shopName: '' })
  const owner = role === 'owner'

  return (
    <div>
      <h1 className="serif" style={{ fontSize: 30 }}>
        People &amp; authority
      </h1>
      <p className="muted">Four login authorities: Customer, Seller, Admin, Owner. Owner can mint staff.</p>
      {owner && (
        <form
          className="dash-form"
          onSubmit={(e) => {
            e.preventDefault()
            const res = createStaff(form)
            if (!res.ok) alert(res.error)
            else setForm({ name: '', email: '', password: 'pass123', phone: '', role: 'admin', shopName: '' })
          }}
        >
          <div className="split">
            <div className="field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className="split">
            <div className="field">
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
                <option value="reseller">Reseller</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            <div className="field">
              <label>Password</label>
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit">
            Create login
          </button>
        </form>
      )}
      <div className="table-wrap">
        <table className="grid-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="role-pill" style={{ background: ROLE_META[u.role]?.color }}>
                    {u.role}
                  </span>
                  {owner && u.role !== 'owner' && (
                    <select value={u.role} onChange={(e) => setUserRole(u.id, e.target.value)} style={{ marginLeft: 8 }}>
                      <option value="customer">customer</option>
                      <option value="reseller">reseller</option>
                      <option value="seller">seller</option>
                      <option value="admin">admin</option>
                    </select>
                  )}
                </td>
                <td>{u.blocked ? 'Blocked' : 'Active'}</td>
                <td>
                  {u.role !== 'owner' && (
                    <button className="linkish" onClick={() => setUserBlocked(u.id, !u.blocked)}>
                      {u.blocked ? 'Unblock' : 'Block'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
