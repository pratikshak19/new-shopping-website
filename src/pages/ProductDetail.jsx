import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  BANK_OFFERS,
  RENTAL_DAY_OPTIONS,
  SIZE_CHARTS,
  discountOf,
  formatINR,
  formatRentalDate,
  relatedOf,
  rentalEndDate,
  rentalQuote,
} from '../data/products'
import { completeTheLook, whyRecommend } from '../lib/styleEngine'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import { Icon } from '../components/Icons'

function tomorrowISO() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

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
    captureReferral,
    shareProduct,
    studentMode,
    budgetLock,
    styleMood,
  } = useStore()
  const product = getProduct(id)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [color, setColor] = useState(product?.colors?.[0])
  const [size, setSize] = useState(product?.sizes?.[0])
  const [shot, setShot] = useState(0)
  const [pin, setPin] = useState('')
  const [pinRes, setPinRes] = useState(null)
  const [chart, setChart] = useState(false)
  const [rv, setRv] = useState({ rating: 5, text: '' })
  const [q, setQ] = useState('')
  const [mode, setMode] = useState(product?.rentalOnly ? 'rent' : 'buy')
  const [rentalDays, setRentalDays] = useState(4)
  const [rentalStart, setRentalStart] = useState(tomorrowISO())
  const [qty, setQty] = useState(1)

  useEffect(() => {
    const ref = params.get('ref')
    if (ref) captureReferral(ref)
    if (product) {
      viewProduct(product.id)
      setColor(product.colors[0])
      setSize(product.sizes[0])
      setShot(0)
      setQty(1)
      setMode(product.rentalOnly || params.get('mode') === 'rent' ? 'rent' : 'buy')
      setRentalDays(product.rental?.maxDays && product.rental.maxDays < 4 ? product.rental.maxDays : 4)
      setRentalStart(tomorrowISO())
    }
  }, [id, params])

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
  const lookExtras = completeTheLook(product, visibleProducts, budgetLock || 0)
  const why = whyRecommend(product, { studentMode, budget: budgetLock || product.price, mood: styleMood })
  const mineR = reviews.filter((r) => r.productId === product.id)
  const mineQ = questions.filter((x) => x.productId === product.id)
  const chartRows = SIZE_CHARTS[product.category]
  const isRent = mode === 'rent' && Boolean(product.rental)
  const quote = isRent ? rentalQuote(product, rentalDays) : null
  const rentalOptions = RENTAL_DAY_OPTIONS.filter(
    (days) => days >= (product.rental?.minDays || 2) && days <= (product.rental?.maxDays || 10)
  )
  const addSelected = () =>
    addToCart(product.id, {
      color,
      size,
      qty,
      mode: isRent ? 'rent' : 'buy',
      rentalDays: quote?.days || rentalDays,
      rentalStart,
    })

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
          {isRent && quote ? (
            <>
              <div className="price-row" style={{ margin: '16px 0 4px' }}>
                <span className="price" style={{ fontSize: 28 }}>{formatINR(quote.fee)}</span>
                <span className="off">for {quote.days} days</span>
              </div>
              <p className="rent-note" style={{ marginBottom: 14 }}>
                {formatINR(quote.perDay)}/day + {formatINR(quote.deposit)} refundable deposit · total due now {formatINR(quote.total)}
              </p>
            </>
          ) : (
            <>
              <div className="price-row" style={{ margin: '16px 0 4px' }}>
                <span className="price" style={{ fontSize: 28 }}>{formatINR(product.price)}</span>
                <span className="mrp">{formatINR(product.mrp)}</span>
                <span className="off">{discountOf(product)}% off</span>
              </div>
              {product.rental && (
                <p className="rent-note" style={{ marginBottom: 14 }}>
                  or rent from {formatINR(product.rental.perDay)}/day + refundable deposit
                </p>
              )}
            </>
          )}
          <p style={{ color: '#444', marginBottom: 16 }}>{product.description}</p>
          {product.rental && (
            <section className="rental-panel" aria-label="Buy or rent options">
              <div className="purchase-toggle" role="tablist" aria-label="Purchase type">
                {!product.rentalOnly && (
                  <button type="button" className={!isRent ? 'on' : ''} onClick={() => setMode('buy')}>
                    Buy
                  </button>
                )}
                <button type="button" className={isRent ? 'on' : ''} onClick={() => setMode('rent')}>
                  Rent
                </button>
              </div>
              {isRent && quote ? (
                <>
                  <div className="rental-grid">
                    <div className="field" style={{ margin: 0 }}>
                      <label htmlFor="rental-start">Rental start date</label>
                      <input
                        id="rental-start"
                        type="date"
                        min={tomorrowISO()}
                        value={rentalStart}
                        onChange={(e) => setRentalStart(e.target.value)}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Rental duration</div>
                      <div className="rental-days">
                        {rentalOptions.map((days) => (
                          <button
                            key={days}
                            type="button"
                            className={`size ${quote.days === days ? 'on' : ''}`}
                            onClick={() => setRentalDays(days)}
                          >
                            {days} days
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ul className="rental-points">
                    <li>Pickup scheduled on {formatRentalDate(rentalEndDate(rentalStart, quote.days))}</li>
                    <li>Professional cleaning and garment cover included</li>
                    <li>{formatINR(quote.deposit)} deposit is refundable after quality check</li>
                    {quote.discount > 0 && <li>Long-rental saving: {formatINR(quote.discount)}</li>}
                  </ul>
                </>
              ) : (
                <p className="muted" style={{ marginTop: 10 }}>
                  Need it only for an event? Switch to Rent and reserve this piece for {product.rental.minDays || 2}–{product.rental.maxDays || 10} days.
                </p>
              )}
            </section>
          )}
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
            {!isRent && product.tryAndBuy && settings.tryAndBuy ? ' · Try & Buy available' : ''}
            {isRent ? ' · Cleaning & pickup included' : product.returnable ? ` · ${settings.returnDays}-day return` : ' · Final sale'}
          </p>
          <div className="why-box">
            <strong>Why we recommend this?</strong>
            <ul>
              {why.map((w) => (
                <li key={w}>✓ {w}</li>
              ))}
            </ul>
            {typeof product.ecoScore === 'number' && (
              <p className="eco-line">Eco Score: {product.ecoScore.toFixed(1)}/10 🌱</p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Quantity</div>
            <div className="qty">
              <button type="button" onClick={() => setQty((v) => Math.max(1, v - 1))} disabled={qty <= 1}>-</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((v) => Math.min(product.stock || 1, v + 1))} disabled={qty >= (product.stock || 1)}>+</button>
            </div>
          </div>
          <div className="pdp-actions">
            <button className="btn btn-primary" disabled={product.stock < 1 || (isRent && !rentalStart)} onClick={addSelected}>
              <Icon.bag style={{ width: 18, height: 18 }} /> {isRent ? 'Add rental to bag' : 'Add to cart'}
            </button>
            <button className="btn btn-dark" disabled={product.stock < 1 || (isRent && !rentalStart)} onClick={() => {
              addSelected()
              navigate(user ? '/checkout' : '/login?next=/checkout')
            }}>
              {isRent ? 'Rent now' : 'Buy now'}
            </button>
            <button className="btn btn-ghost" onClick={() => toggleWishlist(product.id)}>
              {loved ? <Icon.heartFill style={{ width: 18, height: 18, color: 'var(--rose)' }} /> : <Icon.heart style={{ width: 18, height: 18 }} />}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <button className="chip" onClick={() => toggleCompare(product.id)}>
              {compare.includes(product.id) ? 'In compare' : 'Add to compare'}
            </button>
            {user?.role === 'customer' && (
              <button className="chip" onClick={() => shareProduct(product.id)}>Share product</button>
            )}
          </div>
          <div className="meta-box" style={{ marginTop: 12 }}>
            <strong>Bank &amp; wallet offers</strong>
            {BANK_OFFERS.map((b) => (
              <li key={b.bank}>{b.bank}: {b.text}</li>
            ))}
          </div>
          <ul className="meta-box">
            {(product.highlights || []).map((h) => <li key={h}>{h}</li>)}
            <li>{isRent ? 'Rental invoice · Scheduled pickup · Deposit refund after quality check' : `GST invoice · ${product.returnable ? 'Easy returns' : 'No return'} · COD by PIN`}</li>
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
            <p>{item.answer || 'Awaiting admin answer.'}</p>
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

      {lookExtras.length > 0 && (
        <section className="sec" style={{ paddingTop: 0 }}>
          <div className="sec-head">
            <h2>Complete this look ✨</h2>
            <p>Matching earrings, footwear, bag — styling with the buy.</p>
          </div>
          <div className="prod-grid">
            {lookExtras.map((p) => (
              <ProductCard key={p.id} product={p} showWhy />
            ))}
          </div>
        </section>
      )}

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
