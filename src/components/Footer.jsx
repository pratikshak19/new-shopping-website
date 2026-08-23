import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-grid">
        <div>
          <div className="brand-name" style={{ color: '#fff', marginBottom: 10 }}>
            Tren<span style={{ color: '#ff3f6c' }}>dora</span>
          </div>
          <p>India&apos;s style destination — Myntra fashion, Flipkart deals, Meesho seller studio. Four login authorities.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/shop?cat=women">Women</Link>
          <Link to="/shop?cat=men">Men</Link>
          <Link to="/offers">Offers</Link>
          <Link to="/brands">Brands</Link>
          <Link to="/studio">Studio</Link>
          <Link to="/insider">Insider</Link>
        </div>
        <div>
          <h4>Help</h4>
          <Link to="/help">Help centre</Link>
          <Link to="/faq">FAQ &amp; returns</Link>
          <Link to="/orders">Track order</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About</Link>
        </div>
        <div>
          <h4>Project files</h4>
          <Link to="/documents">PDF · Word · PPT</Link>
          <Link to="/login">Customer / Seller / Admin / Owner</Link>
          <a href="/docs/Trendora_Project_Report.pdf" target="_blank" rel="noreferrer">Download report (PDF)</a>
          <a href="/docs/Trendora_Project_Report.docx" target="_blank" rel="noreferrer">Download report (Word)</a>
          <a href="/docs/Trendora_Presentation.pptx" target="_blank" rel="noreferrer">Download slides (PPT)</a>
        </div>
      </div>
      <div className="wrap copy">
        <span>© {new Date().getFullYear()} Trendora · College shopping-website project</span>
        <span>Payments simulated · No real charges</span>
      </div>
    </footer>
  )
}
