import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="empty">
      <h2>404 — aisle not found</h2>
      <p>That page walked out of the warehouse.</p>
      <Link className="btn btn-primary" to="/" style={{ marginTop: 16 }}>
        Back home
      </Link>
    </div>
  )
}
