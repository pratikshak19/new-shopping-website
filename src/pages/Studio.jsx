import { Link } from 'react-router-dom'

const LOOKS = [
  { title: 'Mehendi garden', text: 'Floral midi + kolhapuris + pearl drops', to: '/shop?cat=women', img: '/images/hero-fashion.jpg' },
  { title: 'Campus commute', text: 'Oxford shirt + selvedge + sneakers', to: '/shop?cat=men', img: '/images/cat-men.jpg' },
  { title: 'Desk to dusk', text: 'Blazer + tote + analog watch', to: '/shop?cat=accessories', img: '/images/hero-sale.jpg' },
]

export default function Studio() {
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Studio</h1>
        <p className="muted">Myntra Studio-style lookbooks. Tap a story, land in the shop.</p>
      </div>
      <div className="prod-grid">
        {LOOKS.map((l) => (
          <Link key={l.title} to={l.to} className="cat-card" style={{ minHeight: 280 }}>
            <img src={l.img} alt="" />
            <figcaption>
              <h3>{l.title}</h3>
              <span>{l.text}</span>
            </figcaption>
          </Link>
        ))}
      </div>
    </div>
  )
}
