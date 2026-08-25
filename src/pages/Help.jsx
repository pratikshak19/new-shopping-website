import { useState } from 'react'
import { useStore } from '../context/StoreContext'

export default function Help() {
  const { openTicket, tickets, user } = useStore()
  const [form, setForm] = useState({ subject: '', message: '' })
  const mine = tickets.filter((t) => t.userId === user?.id)
  return (
    <div className="wrap" style={{ paddingBottom: 72, maxWidth: 800 }}>
      <div className="page-hero">
        <h1>Help centre</h1>
        <p className="muted">Orders, returns, size, payments — open a ticket. Admin / owner reply from their console.</p>
      </div>
      <form
        className="summary"
        style={{ position: 'static', marginBottom: 24 }}
        onSubmit={(e) => {
          e.preventDefault()
          openTicket(form)
          setForm({ subject: '', message: '' })
        }}
      >
        <div className="field">
          <label>Subject</label>
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
        </div>
        <div className="field">
          <label>Message</label>
          <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        </div>
        <button className="btn btn-primary" type="submit">Open ticket</button>
      </form>
      {mine.map((t) => (
        <article key={t.id} className="review">
          <strong>{t.subject}</strong> · {t.status}
          <p>{t.message}</p>
          {t.reply && <p><em>Desk:</em> {t.reply}</p>}
        </article>
      ))}
    </div>
  )
}
