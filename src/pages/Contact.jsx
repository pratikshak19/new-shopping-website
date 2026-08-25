import { useState } from 'react'
import { useStore } from '../context/StoreContext'

export default function Contact() {
  const { toast } = useStore()
  const [sent, setSent] = useState(false)
  return (
    <div className="wrap">
      <div className="page-hero">
        <h1>Contact</h1>
        <p style={{ color: 'var(--muted)' }}>Questions for the project team? Send a note.</p>
      </div>
      <div className="contact-grid">
        <form
          className="summary"
          style={{ position: 'static' }}
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
            toast('Message saved locally — thank you')
          }}
        >
          <div className="field">
            <label>Name</label>
            <input required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required />
          </div>
          <div className="field">
            <label>Message</label>
            <textarea rows={5} required />
          </div>
          <button className="btn btn-primary" type="submit">
            Send
          </button>
          {sent && <p style={{ color: 'var(--ok)', marginTop: 10 }}>Received. (Demo only — not emailed.)</p>}
        </form>
        <div className="prose">
          <p>
            <strong>Support hours:</strong> Mon–Sat, 10:00–19:00 IST
          </p>
          <p>
            <strong>Email:</strong> hello@trendora.demo
          </p>
          <p>
            <strong>Phone:</strong> 1800-123-8765 (fictional)
          </p>
          <p>For the project report, treat this form as the customer-service module of the system.</p>
        </div>
      </div>
    </div>
  )
}
