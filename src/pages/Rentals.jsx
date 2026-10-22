import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'

const STEPS = [
  ['1', 'Choose your dates', 'Pick a start date and rent for 2, 4, 7 or 10 days.'],
  ['2', 'We deliver it ready', 'Your outfit arrives cleaned, pressed and packed in a garment cover.'],
  ['3', 'Wear the look', 'Enjoy the event without paying the full purchase price.'],
  ['4', 'We pick it up', 'Doorstep pickup is scheduled automatically. The deposit is refunded after quality check.'],
]

export default function Rentals() {
  const { visibleProducts } = useStore()
  const rentals = useMemo(() => visibleProducts.filter((p) => p.rental), [visibleProducts])
  const occasions = useMemo(
    () => [...new Set(rentals.flatMap((p) => p.rental?.occasions || []))].sort(),
    [rentals]
  )
  const [category, setCategory] = useState('')
  const [occasion, setOccasion] = useState('')
  const [maxRent, setMaxRent] = useState(1500)
  const [sort, setSort] = useState('featured')

  const list = useMemo(() => {
    let items = rentals.filter((p) => (p.rental?.perDay || 0) <= maxRent)
    if (category) items = items.filter((p) => p.category === category)
    if (occasion) items = items.filter((p) => (p.rental?.occasions || []).includes(occasion))
    if (sort === 'rent-asc') items.sort((a, b) => a.rental.perDay - b.rental.perDay)
    if (sort === 'rent-desc') items.sort((a, b) => b.rental.perDay - a.rental.perDay)
    if (sort === 'rating') items.sort((a, b) => b.rating - a.rating)
    if (sort === 'featured') items.sort((a, b) => Number(b.rentalOnly || false) - Number(a.rentalOnly || false) || (b.reviews || 0) - (a.reviews || 0))
    return items
  }, [rentals, category, occasion, maxRent, sort])

  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <section className="rental-hero">
        <div>
          <p className="eyebrow">Trendify Rentals</p>
          <h1>Clothes on rent, ready for the occasion</h1>
          <p>
            Reserve premium gowns, lehengas, sherwanis, tuxedos, suits and festive clothing by the day.
            Cleaning, garment cover and scheduled pickup are included.
          </p>
          <div className="rental-hero-actions">
            <a className="btn btn-primary" href="#rental-catalogue">Browse rental clothes</a>
            <Link className="btn btn-ghost" to="/collections">View collections</Link>
          </div>
        </div>
        <img src="/images/products/emerald-bridal-lehenga.jpg" alt="Emerald bridal lehenga available on rent" />
      </section>

      <section className="rental-steps" aria-label="How renting works">
        {STEPS.map(([number, title, text]) => (
          <article key={number}>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section id="rental-catalogue" className="rental-catalogue">
        <div className="sec-head" style={{ marginBottom: 18 }}>
          <div>
            <p>Available now</p>
            <h2>{list.length} rental styles</h2>
          </div>
          <select className="rental-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort rentals">
            <option value="featured">Featured</option>
            <option value="rent-asc">Rent: low to high</option>
            <option value="rent-desc">Rent: high to low</option>
            <option value="rating">Customer rating</option>
          </select>
        </div>

        <div className="rental-filters">
          <div>
            <strong>Category</strong>
            <div className="rental-chip-row">
              <button type="button" className={`chip ${!category ? 'on' : ''}`} onClick={() => setCategory('')}>All</button>
              {CATEGORIES.filter((c) => rentals.some((p) => p.category === c.id)).map((c) => (
                <button key={c.id} type="button" className={`chip ${category === c.id ? 'on' : ''}`} onClick={() => setCategory(c.id)}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <strong>Occasion</strong>
            <div className="rental-chip-row">
              <button type="button" className={`chip ${!occasion ? 'on' : ''}`} onClick={() => setOccasion('')}>Any occasion</button>
              {occasions.map((item) => (
                <button key={item} type="button" className={`chip ${occasion === item ? 'on' : ''}`} onClick={() => setOccasion(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <label className="rental-budget">
            <span>Max rent: <strong>{formatINR(maxRent)}/day</strong></span>
            <input type="range" min="199" max="1500" step="50" value={maxRent} onChange={(e) => setMaxRent(+e.target.value)} />
          </label>
        </div>

        {list.length ? (
          <div className="prod-grid">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} showWhy />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>No rentals match these filters</h2>
            <p>Increase the daily budget or clear one filter.</p>
            <button
              className="btn btn-primary"
              type="button"
              style={{ marginTop: 16 }}
              onClick={() => {
                setCategory('')
                setOccasion('')
                setMaxRent(1500)
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="rental-policy">
        <article>
          <h2>Refundable deposit</h2>
          <p>The deposit is shown before checkout and refunded after pickup and quality check, provided the outfit is returned complete and undamaged.</p>
        </article>
        <article>
          <h2>Cleaning included</h2>
          <p>Every rental is professionally cleaned, checked and pressed before delivery. Please do not wash delicate rental pieces at home.</p>
        </article>
        <article>
          <h2>Fit support</h2>
          <p>Choose your usual size and check the product size chart. Keep all tags, accessories and garment covers together for pickup.</p>
        </article>
      </section>
    </div>
  )
}
