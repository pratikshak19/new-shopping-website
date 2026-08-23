import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SIZE_CHARTS, discountOf, formatINR, relatedOf } from '../data/products'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import { Icon } from '../components/Icons'

export default function ProductDetail() {
  const { id } = useParams()
  const {
    getProduct,
    visibleProducts,
    addToCart,
    toggleWishlist,
    wishlist,
    addReview,
    addQuestion,
    reviews,
    questions,
    viewProduct,
    toggleCompare,
    compare,
    checkPincode,
    user,
    settings,
  } = useStore()
  const product = getProduct(id)
  const navigate = useNavigate()
  const [color, setColor] = useState(product?.colors?.[0])
  const [size, setSize] = useState(product?.sizes?.[0])
  const [shot, setShot] = useState(0)
  const [pin, setPin] = useState('')
  const [pinRes, setPinRes] = useState(null)
  const [chart, setChart] = useState(false)
  const [rv, setRv] = useState({ rating: 5, text: '' })
  const [q, setQ] = useState('')

  useEffect(() => {
    if (product) {
      viewProduct(product.id)
      setColor(product.colors[0])
      setSize(product.sizes[0])
      setShot(0)
    }
  }, [id])

  if (!product || product.status === 'hidden') {
    return (
      <div className="empty">
        <h2>Product not found</h2>
        <Link className="btn btn-primary" to="/shop">Back to shop</Link>
      </div>
    )
  }

  const loved = wishlist.includes(product.id)
  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const related = relatedOf(product, visibleProducts)
  const mineR = reviews.filter((r) => r.productId === product.id)
  const mineQ = questions.filter((x) => x.productId === product.id)
  const chartRows = SIZE_CHARTS[product.category]

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
                <button key={g + i} onClick={() => setShot(i)} style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', border: i === shot ? '2px solid #1a1a2e' : '1px solid #e8e4df' }}>
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
            <Icon.star /> {product.rating} · {(product.reviews || 0).toLocaleString('en-IN')} reviews
          </div>
          <div className="price-row" style={{ margin: '16px 0' }}>
            <span className="price" style={{ fontSize: 28 }}>{formatINR(product.price)}</span>
            <span className="mrp">{formatINR(product.mrp)}</span>
            <span className="off">{discountOf(product)}% off</span>
          </div>
          <p style={{ color: '#444', marginBottom: 16 }}>{product.description}</p>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Colour</div>
          <div className="swatches">
            {product.colors.map((c) => (
              <button key={c} className={`swatch ${c === color ? 'on' : ''}`} onClick={() => setColor(c)}>{c}</button>
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Size {chartRows && (
              <button className="linkish" onClick={() => setChart((v) => !v)}>size chart</button>
            )}
          </div>
          <div className="sizes">
            {product.sizes.map((s) => (
              <button key={s} className={`size ${s === size ? 'on' : ''}`} onClick={() => setSize(s)}>{s}</button>
            ))}
          </div>
          {chart && chartRows && (
            <table className="grid-table" style={{ marginBottom: 16 }}>
              <tbody>
                {chartRows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell) => (i === 0 ? <th key={cell}>{cell}</th> : <td key={cell}>{cell}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <form
            className="coupon"
            onSubmit={(e) => {
              e.preventDefault()
              setPinRes(checkPincode(pin))
            }}
          >
            <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter PIN for delivery" maxLength={6} />
            <button className="btn btn-ghost" type="submit">Check</button>
          </form>
          {pinRes && <p style={{ fontSize: 13, color: pinRes.ok ? 'var(--ok)' : '#be123c' }}>{pinRes.text || pinRes.error}</p>}
          <p style={{ fontSize: 13, color: product.stock < 10 ? 'var(--warn)' : 'var(--muted)' }}>
            {product.stock < 1 ? 'Out of stock' : product.stock < 10 ? `Only ${product.stock} left` : `${product.stock} in stock`}
            {product.tryAndBuy && settings.tryAndBuy ? ' · Try & Buy available' : ''}
            {product.returnable ? ` · ${settings.returnDays}-day return` : ' · Final sale'}
          </p>
          <div className="pdp-actions">
            <button className="btn btn-primary" disabled={product.stock < 1} onClick={() => addToCart(product.id, { color, size })}>
              <Icon.bag style={{ width: 18, height: 18 }} /> Add to bag
            </button>
            <button className="btn btn-dark" disabled={product.stock < 1} onClick={() => { addToCart(product.id, { color, size }); navigate('/checkout') }}>
              Buy now
            </button>
            <button className="btn btn-ghost" onClick={() => toggleWishlist(product.id)}>
              {loved ? <Icon.heartFill style={{ width: 18, height: 18, color: 'var(--rose)' }} /> : <Icon.heart style={{ width: 18, height: 18 }} />}
            </button>
          </div>
          <button className="chip" onClick={() => toggleCompare(product.id)}>
            {compare.includes(product.id) ? 'In compare' : 'Add to compare'}
          </button>
          <ul className="meta-box">
            {(product.highlights || []).map((h) => <li key={h}>{h}</li>)}
            <li>GST invoice · {product.returnable ? 'Easy returns' : 'No return'} · COD by PIN</li>
          </ul>
        </div>
      </div>

      <section className="sec" style={{ paddingTop: 0 }}>
        <h2>Ratings &amp; reviews</h2>
        {mineR.map((r) => (
          <article key={r.id} className="review">
            <strong>{r.rating}★ {r.name}</strong>
            <p>{r.text}</p>
          </article>
        ))}
        {user ? (
          <form
            className="dash-form"
            onSubmit={(e) => {
              e.preventDefault()
              addReview({ productId: product.id, ...rv })
              setRv({ rating: 5, text: '' })
            }}
          >
            <div className="field">
              <label>Your rating</label>
              <select value={rv.rating} onChange={(e) => setRv({ ...rv, rating: +e.target.value })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
              </select>
            </div>
            <div className="field">
              <label>Review</label>
              <textarea rows={3} value={rv.text} onChange={(e) => setRv({ ...rv, text: e.target.value })} required />
            </div>
            <button className="btn btn-primary" type="submit">Publish review</button>
          </form>
        ) : (
          <p><Link to="/login">Sign in</Link> to review.</p>
        )}
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <h2>Questions</h2>
        {mineQ.map((item) => (
          <article key={item.id} className="review">
            <strong>Q. {item.question}</strong>
            <p>{item.answer || 'Awaiting seller / admin answer.'}</p>
          </article>
        ))}
        {user && (
          <form
            className="coupon"
            onSubmit={(e) => {
              e.preventDefault()
              addQuestion({ productId: product.id, question: q })
              setQ('')
            }}
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about fit, fabric, battery..." required />
            <button className="btn btn-ghost" type="submit">Ask</button>
          </form>
        )}
      </section>

      {related.length > 0 && (
        <section className="sec" style={{ paddingTop: 0 }}>
          <div className="sec-head"><h2>Similar picks</h2></div>
          <div className="prod-grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
