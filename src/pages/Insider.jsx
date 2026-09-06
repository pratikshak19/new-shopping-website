import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Insider() {
  const { user, tier } = useStore()
  return (
    <div className="wrap prose" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Trendora Insider</h1>
      </div>
      <p>Myntra Insider analogue. Earn 1 point per ₹10. Tiers: Member → Elite (800) → Icon (2500).</p>
      {user ? (
        <p>
          You are <strong>{tier.name}</strong> with <strong>{user.points || 0}</strong> points. Perks: {tier.perks}.
          Elite+ can use coupon <code>INSIDER15</code>.
        </p>
      ) : (
        <p>
          <Link to="/login">Sign in</Link> to start earning.
        </p>
      )}
    </div>
  )
}
