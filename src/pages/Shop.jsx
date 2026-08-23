import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BRANDS, CATEGORIES, searchProducts } from '../data/products'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  const { visibleProducts } = useStore()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const cat = params.get('cat') || ''
  const tag = params.get('tag') || ''
  const brandQ = params.get('brand') || ''
  const [brand, setBrand] = useState(brandQ)
  useEffect(() => { setBrand(brandQ) }, [brandQ])
  const [maxPrice, setMaxPrice] = useState(70000)
  const [minRating, setMinRating] = useState(0)
  const [sort, setSort] = useState('popular')

  const list = useMemo(() => {
    let items = q ? searchProducts(q, visibleProducts) : [...visibleProducts]
    if (cat) items = items.filter((p) => p.category === cat)
    if (tag) items = items.filter((p) => (p.tags || []).includes(tag))
    if (brand) items = items.filter((p) => p.brand === brand)
    items = items.filter((p) => p.price <= maxPrice && p.rating >= minRating)
    if (sort === 'price-asc') items.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') items.sort((a, b) => b.price - a.price)
    if (sort === 'rating') items.sort((a, b) => b.rating - a.rating)
    if (sort === 'newest') items.sort((a, b) => b.id.localeCompare(a.id))
    if (sort === 'popular') items.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    return items
  }, [visibleProducts, q, cat, tag, brand, maxPrice, minRating, sort])

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
      </aside>
      <section>
        <div className="shop-top">
          <div>
            <h1 className="serif" style={{ fontSize: 32 }}>{heading}</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>{list.length} styles</p>
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">Popularity</option>
            <option value="newest">What&apos;s new</option>
            <option value="rating">Customer rating</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
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
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
