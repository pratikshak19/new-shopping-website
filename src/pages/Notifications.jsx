import { useEffect } from 'react'
import { useStore } from '../context/StoreContext'

export default function Notifications() {
  const { notifications, markNotesRead } = useStore()
  useEffect(() => {
    markNotesRead()
  }, [])
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Notifications</h1>
      </div>
      {notifications.map((n) => (
        <article key={n.id} className="order-card">
          <div>
            <strong>{n.title}</strong>
            <p>{n.text}</p>
            <p className="muted">{new Date(n.at).toLocaleString('en-IN')}</p>
          </div>
        </article>
      ))}
      {notifications.length === 0 && <p className="muted">No alerts.</p>}
    </div>
  )
}
