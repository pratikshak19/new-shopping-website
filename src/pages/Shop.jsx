import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BRANDS, CATEGORIES, discountOf, searchProducts } from '../data/products'
import { MOODS } from '../lib/styleEngine'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  const { visibleProducts, studentMode, setStudentMode, budgetLock, styleMood, setStyleMood } = useStore()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const cat = params.get('cat') || ''
  const tag = params.get('tag') || ''
  const brandQ = params.get('brand') || ''
  const ecoQ = params.get('eco') === '1'
  const [brand, setBrand] = useState(brandQ)
  useEffect(() => {
    setBrand(brandQ)
  }, [brandQ])
  const [maxPrice, setMaxPrice] = useState(budgetLock || 70000)
  const [minRating, setMinRating] = useState(0)
  const [minOff, setMinOff] = useState(0)
  const [sort, setSort] = useState('popular')
  const [ecoOnly, setEcoOnly] = useState(ecoQ)

  const brandOptions = useMemo(() => {
    const pool = cat ? visibleProducts.filter((p) => p.category === cat) : visibleProducts
    return BRANDS.filter((b) => pool.some((p) => p.brand === b))
  }, [visibleProducts, cat])

  useEffect(() => {
    if (brand && !brandOptions.includes(brand)) setBrand('')
  }, [brand, brandOptions])

  useEffect(() => {
    if (budgetLock) setMaxPrice((m) => Math.min(m, budgetLock))
  }, [budgetLock])

  const list = useMemo(() => {
    let items = q ? searchProducts(q, visibleProducts) : [...visibleProducts]
    if (cat) items = items.filter((p) => p.category === cat)
    if (tag) items = items.filter((p) => (p.tags || []).includes(tag))
    if (brand) items = items.filter((p) => p.brand === brand)
    if (styleMood) items = items.filter((p) => (p.moods || []).includes(styleMood))
    if (studentMode) items = items.filter((p) => p.student || p.price <= 1600 || p.slot === 'stationery')
    if (ecoOnly) items = items.filter((p) => (p.ecoScore || 0) >= 8)
    items = items.filter((p) => p.price <= maxPrice && p.rating >= minRating && discountOf(p) >= minOff)
    if (sort === 'discount') items.sort((a, b) => discountOf(b) - discountOf(a))
    if (sort === 'price-asc') items.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') items.sort((a, b) => b.price - a.price)
    if (sort === 'rating') items.sort((a, b) => b.rating - a.rating)
    if (sort === 'newest') items.sort((a, b) => b.id.localeCompare(a.id))
    if (sort === 'popular') items.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    if (sort === 'eco') items.sort((a, b) => (b.ecoScore || 0) - (a.ecoScore || 0))
    return items
  }, [visibleProducts, q, cat, tag, brand, maxPrice, minRating, minOff, sort, styleMood, studentMode, ecoOnly])

  const setCat = (id) => {
    const next = new URLSearchParams(params)
    if (id) next.set('cat', id)
    else next.delete('cat')
    setParams(next)
  }

  const heading = cat
    ? CATEGORIES.find((c) => c.id === cat)?.name || 'Shop'
    : q
      ? `Results for “${q}”`
      : tag
        ? `Tagged: ${tag}`
        : brand
          ? brand
          : 'All products'

  return (
    <div className="wrap shop">
      <aside className="filters">
        <h3>Smart</h3>
        <label className="filter-opt">
          <input type="checkbox" checked={studentMode} onChange={(e) => setStudentMode(e.target.checked)} /> Student Mode
        </label>
        <label className="filter-opt">
          <input type="checkbox" checked={ecoOnly} onChange={(e) => setEcoOnly(e.target.checked)} /> Eco-friendly 8+
        </label>
        <Link className="linkish" to="/style">
          Open Style Assistant
        </Link>
        <h3>Mood</h3>
        <label className="filter-opt">
          <input type="radio" checked={!styleMood} onChange={() => setStyleMood('')} /> Any mood
        </label>
        {MOODS.map((m) => (
          <label key={m.id} className="filter-opt">
            <input type="radio" checked={styleMood === m.id} onChange={() => setStyleMood(m.id)} /> {m.emoji} {m.label}
          </label>
        ))}
        <h3>Category</h3>
        <label className="filter-opt">
          <input type="radio" checked={!cat} onChange={() => setCat('')} /> All
        </label>
        {CATEGORIES.map((c) => (
          <label key={c.id} className="filter-opt">
            <input type="radio" checked={cat === c.id} onChange={() => setCat(c.id)} /> {c.name}
          </label>
        ))}
        <h3>Brand</h3>
        <label className="filter-opt">
          <input type="radio" checked={!brand} onChange={() => setBrand('')} /> All brands
        </label>
        {BRANDS.map((b) => (
          <label key={b} className="filter-opt">
            <input type="radio" checked={brand === b} onChange={() => setBrand(b)} /> {b}
          </label>
        ))}
        <h3>Max price · ₹{maxPrice.toLocaleString('en-IN')}</h3>
        <input className="range" type="range" min="500" max="70000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />
        <h3>Rating</h3>
        {[0, 4, 4.5].map((r) => (
          <label key={r} className="filter-opt">
            <input type="radio" checked={minRating === r} onChange={() => setMinRating(r)} />
            {r === 0 ? 'Any rating' : `${r}+ stars`}
          </label>
        ))}
        <h3>Discount</h3>
        {[0, 30, 40, 50, 60].map((d) => (
          <label key={d} className="filter-opt">
            <input type="radio" checked={minOff === d} onChange={() => setMinOff(d)} />
            {d === 0 ? 'Any discount' : `${d}% and above`}
          </label>
        ))}
      </aside>
      <section>
        <div className="shop-top">
          <div>
            <h1 className="serif" style={{ fontSize: 32 }}>{heading}</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              {list.length} styles
              {budgetLock ? ` · budget lock ₹${budgetLock.toLocaleString('en-IN')}` : ''}
              {styleMood ? ` · ${styleMood}` : ''}
            </p>
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">Popularity</option>
            <option value="newest">What&apos;s new</option>
            <option value="rating">Customer rating</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="discount">Better discount</option>
            <option value="eco">Eco score</option>
          </select>
        </div>
        {list.length === 0 ? (
          <div className="empty">
            <h2>No matches</h2>
            <p>Try clearing a filter or searching a different word.</p>
          </div>
        ) : (
          <div className="prod-grid">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} showWhy />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
