import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BRANDS, CATEGORIES, COLLECTIONS, collectionById, discountOf, searchProducts } from '../data/products'
import { MOODS } from '../lib/styleEngine'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  const { visibleProducts, studentMode, setStudentMode, budgetLock, setBudgetLock, styleMood, setStyleMood } = useStore()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const cat = params.get('cat') || ''
  const tag = params.get('tag') || ''
  const brandQ = params.get('brand') || ''
  const collection = params.get('collection') || ''
  const shoppingMode = params.get('mode') || ''
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
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')

  const brandOptions = useMemo(() => {
    const pool = cat ? visibleProducts.filter((p) => p.category === cat) : visibleProducts
    return BRANDS.filter((b) => pool.some((p) => p.brand === b))
  }, [visibleProducts, cat])

  useEffect(() => {
    if (brand && !brandOptions.includes(brand)) setBrand('')
  }, [brand, brandOptions])

  const colorOptions = useMemo(() => {
    const pool = cat ? visibleProducts.filter((p) => p.category === cat) : visibleProducts
    return [...new Set(pool.flatMap((p) => p.colors || []))].sort()
  }, [visibleProducts, cat])

  const sizeOptions = useMemo(() => {
    const pool = cat ? visibleProducts.filter((p) => p.category === cat) : visibleProducts
    return [...new Set(pool.flatMap((p) => p.sizes || []))]
  }, [visibleProducts, cat])

  useEffect(() => {
    if (color && !colorOptions.includes(color)) setColor('')
    if (size && !sizeOptions.includes(size)) setSize('')
  }, [color, colorOptions, size, sizeOptions])

  useEffect(() => {
    if (budgetLock) setMaxPrice((m) => Math.min(m, budgetLock))
  }, [budgetLock])

  useEffect(() => {
    if (!cat) return
    // Opening a department is a fresh browse intent. A mood, Student Mode,
    // or budget saved earlier by Style Assistant must not silently hide
    // every Kids/Women/Men product in that department.
    setStyleMood('')
    setStudentMode(false)
    setBudgetLock(0)
    setMaxPrice(70000)
  }, [cat, setBudgetLock, setStudentMode, setStyleMood])

  const list = useMemo(() => {
    const effectivePrice = (p) => (shoppingMode === 'rent' || shoppingMode === 'rent-only' ? p.rental?.perDay || p.price : p.price)
    let items = q ? searchProducts(q, visibleProducts) : [...visibleProducts]
    if (cat) items = items.filter((p) => p.category === cat)
    if (collection) items = items.filter((p) => (p.collections || []).includes(collection))
    if (tag) items = items.filter((p) => (p.tags || []).includes(tag))
    if (brand) items = items.filter((p) => p.brand === brand)
    if (color) items = items.filter((p) => (p.colors || []).includes(color))
    if (size) items = items.filter((p) => (p.sizes || []).includes(size))
    // Buy view lists the complete catalogue. Rental-only cards stay visible
    // here too, while their card action remains Rent instead of Add to cart.
    if (shoppingMode === 'rent') items = items.filter((p) => p.rental)
    if (shoppingMode === 'rent-only') items = items.filter((p) => p.rentalOnly)
    if (styleMood) items = items.filter((p) => (p.moods || []).includes(styleMood))
    if (studentMode) items = items.filter((p) => p.student || effectivePrice(p) <= 1600 || p.slot === 'stationery')
    if (ecoOnly) items = items.filter((p) => (p.ecoScore || 0) >= 8)
    items = items.filter((p) => effectivePrice(p) <= maxPrice && p.rating >= minRating && (p.rentalOnly ? minOff === 0 : discountOf(p) >= minOff))
    if (sort === 'discount') items.sort((a, b) => discountOf(b) - discountOf(a))
    if (sort === 'price-asc') items.sort((a, b) => effectivePrice(a) - effectivePrice(b))
    if (sort === 'price-desc') items.sort((a, b) => effectivePrice(b) - effectivePrice(a))
    if (sort === 'rating') items.sort((a, b) => b.rating - a.rating)
    if (sort === 'newest') items.sort((a, b) => b.id.localeCompare(a.id))
    if (sort === 'popular') items.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    if (sort === 'eco') items.sort((a, b) => (b.ecoScore || 0) - (a.ecoScore || 0))
    return items
  }, [visibleProducts, q, cat, collection, shoppingMode, tag, brand, color, size, maxPrice, minRating, minOff, sort, styleMood, studentMode, ecoOnly])

  const setCat = (id) => {
    const next = new URLSearchParams(params)
    if (id) next.set('cat', id)
    else next.delete('cat')
    setParams(next)
  }

  const setCollection = (id) => {
    const next = new URLSearchParams(params)
    if (id) next.set('collection', id)
    else next.delete('collection')
    setParams(next)
  }

  const setShoppingMode = (id) => {
    const next = new URLSearchParams(params)
    if (id) next.set('mode', id)
    else next.delete('mode')
    setParams(next)
  }

  const heading = collection
    ? collectionById(collection)?.name || 'Collection'
    : shoppingMode === 'rent' || shoppingMode === 'rent-only'
      ? 'Clothes on Rent'
      : shoppingMode === 'buy'
        ? 'Buy'
        : cat
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
        <h3>Collections</h3>
        <label className="filter-opt">
          <input type="radio" checked={!collection} onChange={() => setCollection('')} /> All collections
        </label>
        {COLLECTIONS.map((c) => (
          <label key={c.id} className="filter-opt">
            <input type="radio" checked={collection === c.id} onChange={() => setCollection(c.id)} /> {c.name}
          </label>
        ))}
        <h3>Buy or Rent</h3>
        {[
          ['', 'All styles'],
          ['buy', 'Buy'],
          ['rent', 'Rent available'],
          ['rent-only', 'Rent only'],
        ].map(([id, label]) => (
          <label key={id || 'all'} className="filter-opt">
            <input type="radio" checked={shoppingMode === id} onChange={() => setShoppingMode(id)} /> {label}
          </label>
        ))}
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
        {brandOptions.map((b) => (
          <label key={b} className="filter-opt">
            <input type="radio" checked={brand === b} onChange={() => setBrand(b)} /> {b}
          </label>
        ))}
        <h3>Colour</h3>
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: '100%', background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '8px 12px' }}
        >
          <option value="">All colours</option>
          {colorOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <h3>Size</h3>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          style={{ width: '100%', background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '8px 12px' }}
        >
          <option value="">All sizes</option>
          {sizeOptions.map((sz) => (
            <option key={sz} value={sz}>{sz}</option>
          ))}
        </select>
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
              {collection ? ` · ${collectionById(collection)?.kicker || 'Curated collection'}` : ''}
              {shoppingMode ? ` · ${shoppingMode.replace('-', ' ')}` : ''}
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
