import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const empty = { name: '', phone: '', line1: '', city: '', state: '', pin: '' }

export default function Addresses() {
  const { user, addresses, saveAddress, deleteAddress } = useStore()
  const [form, setForm] = useState(empty)
  if (!user) return <Navigate to="/login" replace />
  const mine = addresses.filter((a) => a.userId === user.id)
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Saved addresses</h1>
      </div>
      <div className="contact-grid">
        <form
          className="summary"
          style={{ position: 'static' }}
          onSubmit={(e) => {
            e.preventDefault()
            saveAddress(form)
            setForm(empty)
          }}
        >
          {Object.keys(empty).map((k) => (
            <div className="field" key={k}>
              <label>{k}</label>
              <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required />
            </div>
          ))}
          <button className="btn btn-primary" type="submit">Save address</button>
        </form>
        <div>
          {mine.map((a) => (
            <article key={a.id} className="order-card">
              <div>
                <strong>{a.name}</strong>
                <p>{a.line1}, {a.city}, {a.state} {a.pin}</p>
                <p>{a.phone}</p>
              </div>
              <button className="linkish" onClick={() => deleteAddress(a.id)}>Delete</button>
            </article>
          ))}
          {mine.length === 0 && <p className="muted">No addresses yet.</p>}
        </div>
      </div>
    </div>
  )
}
