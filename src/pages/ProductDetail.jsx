import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { discountOf, formatINR, getProduct, relatedOf } from '../data/products'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import { Icon } from '../components/Icons'

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProduct(id)
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const navigate = useNavigate()
  const [color, setColor] = useState(product?.colors[0])
  const [size, setSize] = useState(product?.sizes[0])
  const [shot, setShot] = useState(0)

  if (!product) {
    return (
      <div className="empty">
        <h2>Product not found</h2>
        <Link className="btn btn-primary" to="/shop">
          Back to shop
        </Link>
      </div>
    )
  }

  const loved = wishlist.includes(product.id)
  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const related = relatedOf(product)

  const buy = () => {
    addToCart(product.id, { color, size })
    navigate('/checkout')
  }

  return (
    <div className="wrap">
      <div className="pdp">
        <div className="gallery">
          <div className="gallery-main">
            <ProductImage src={gallery[shot]} alt={product.name} />
          </div>
          {gallery.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {gallery.map((g, i) => (
                <button key={g} onClick={() => setShot(i)} style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', border: i === shot ? '2px solid #1a1a2e' : '1px solid #e8e4df' }}>
                  <ProductImage src={g} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="pdp-brand">{product.brand}</div>
          <h1>{product.name}</h1>
          <div className="rating">
            <Icon.star /> {product.rating} · {product.reviews.toLocaleString('en-IN')} reviews
          </div>
          <div className="price-row" style={{ margin: '16px 0' }}>
            <span className="price" style={{ fontSize: 28 }}>
              {formatINR(product.price)}
            </span>
            <span className="mrp">{formatINR(product.mrp)}</span>
            <span className="off">{discountOf(product)}% off</span>
          </div>
          <p style={{ color: '#444', marginBottom: 16 }}>{product.description}</p>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Colour</div>
          <div className="swatches">
            {product.colors.map((c) => (
              <button key={c} className={`swatch ${c === color ? 'on' : ''}`} onClick={() => setColor(c)}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Size</div>
          <div className="sizes">
            {product.sizes.map((s) => (
              <button key={s} className={`size ${s === size ? 'on' : ''}`} onClick={() => setSize(s)}>
                {s}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 13, color: product.stock < 10 ? 'var(--warn)' : 'var(--muted)' }}>
            {product.stock < 10 ? `Only ${product.stock} left` : `${product.stock} in stock`} · Delivery in 3–5 days
          </p>
          <div className="pdp-actions">
            <button className="btn btn-primary" onClick={() => addToCart(product.id, { color, size })}>
              <Icon.bag style={{ width: 18, height: 18 }} /> Add to bag
            </button>
            <button className="btn btn-dark" onClick={buy}>
              Buy now
            </button>
            <button className="btn btn-ghost" onClick={() => toggleWishlist(product.id)}>
              {loved ? <Icon.heartFill style={{ width: 18, height: 18, color: 'var(--rose)' }} /> : <Icon.heart style={{ width: 18, height: 18 }} />}
            </button>
          </div>
          <ul className="meta-box">
            {product.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
            <li>7-day return · COD available · GST invoice</li>
          </ul>
        </div>
      </div>
      {related.length > 0 && (
        <section className="sec" style={{ paddingTop: 0 }}>
          <div className="sec-head">
            <h2>Similar picks</h2>
          </div>
          <div className="prod-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
