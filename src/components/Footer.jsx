import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-grid">
        <div>
          <div className="brand-name" style={{ color: '#fff', marginBottom: 10 }}>
            Tren<span style={{ color: '#ff3f6c' }}>dora</span>
          </div>
          <p>
            India&apos;s style destination — fashion, electronics, beauty and home, curated
            like Myntra, priced like a smart Flipkart haul.
          </p>
          <p>Built as a full-stack style college project with a real shopping journey.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/shop?cat=women">Women</Link>
          <Link to="/shop?cat=men">Men</Link>
          <Link to="/shop?cat=electronics">Electronics</Link>
          <Link to="/shop?cat=beauty">Beauty</Link>
          <Link to="/shop?cat=home">Home</Link>
        </div>
        <div>
          <h4>Help</h4>
          <Link to="/faq">FAQ &amp; returns</Link>
          <Link to="/orders">Track order</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="/about">About Trendora</Link>
        </div>
        <div>
          <h4>For your viva</h4>
          <a href="/docs/presentation.html" target="_blank" rel="noreferrer">Presentation slides</a>
          <a href="/docs/project-report.html" target="_blank" rel="noreferrer">Project report</a>
          <a href="/docs/how-it-was-built.html" target="_blank" rel="noreferrer">How it was built</a>
        </div>
      </div>
      <div className="wrap copy">
        <span>© {new Date().getFullYear()} Trendora · College shopping-website project</span>
        <span>Payments simulated · No real charges</span>
      </div>
    </footer>
  )
}
