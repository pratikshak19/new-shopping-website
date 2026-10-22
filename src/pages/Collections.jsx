import { Link } from 'react-router-dom'
import { COLLECTIONS, formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'

export default function Collections() {
  const { visibleProducts } = useStore()
  const newArrivals = visibleProducts
    .filter((p) => (p.collections || []).includes('new-season'))
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 8)

  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="eyebrow">Trendify collections</p>
        <h1>New collections, curated by occasion</h1>
        <p className="muted" style={{ maxWidth: 760 }}>
          Shop complete edits instead of endless product lists — new-season drops, wedding looks, campus fits,
          workwear, ethnic craft and premium pieces you can also rent.
        </p>
      </div>

      <div className="collection-grid">
        {COLLECTIONS.map((collection) => {
          const items = visibleProducts.filter((p) => (p.collections || []).includes(collection.id))
          const startingPrice = items.length ? Math.min(...items.map((p) => p.rentalOnly ? p.rental?.perDay || p.price : p.price)) : 0
          return (
            <Link key={collection.id} className="collection-card" to={`/shop?collection=${collection.id}`}>
              <img src={collection.image} alt="" />
              <div className="collection-card-body">
                <p>{collection.kicker}</p>
                <h2>{collection.name}</h2>
                <span>{collection.description}</span>
                <strong>
                  {items.length} styles{startingPrice ? ` · from ${formatINR(startingPrice)}${collection.id === 'rental-occasion' ? '/day' : ''}` : ''}
                </strong>
              </div>
            </Link>
          )
        })}
      </div>

      <section className="sec" style={{ paddingBottom: 24 }}>
        <div className="sec-head">
          <div>
            <p>Just launched</p>
            <h2>New Season Drop</h2>
          </div>
          <Link className="link-more" to="/shop?collection=new-season">Shop all new arrivals</Link>
        </div>
        <div className="prod-grid">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} showWhy />
          ))}
        </div>
      </section>

      <Link to="/rentals" className="rental-banner">
        <div>
          <p className="eyebrow">New on Trendify</p>
          <h2>Rent the look for one special day</h2>
          <p>Gowns, lehengas, sherwanis, tuxedos and formal sets for 2–10 days, with cleaning and pickup included.</p>
        </div>
        <span className="btn btn-primary">Explore rentals</span>
      </Link>
    </div>
  )
}
