import { Link } from 'react-router-dom'
import { discountOf, formatINR } from '../data/products'
import { whyRecommend } from '../lib/styleEngine'
import { useStore } from '../context/StoreContext'
import { Icon } from './Icons'
import ProductImage from './ProductImage'

export default function ProductCard({ product, wishMove, showWhy }) {
  const { wishlist, toggleWishlist, addToCart, moveWishlistToBag, studentMode, budgetLock, styleMood } = useStore()
  const loved = wishlist.includes(product.id)
  const tag = product.tags?.[0]
  const why = showWhy ? whyRecommend(product, { studentMode, budget: budgetLock, mood: styleMood }) : []
  return (
    <article className="pcard">
      <div className="pcard-img">
        <Link to={`/product/${product.id}`}>
          <ProductImage src={product.image} alt={product.name} />
        </Link>
        {tag && <span className={`tag ${tag}`}>{tag}</span>}
        {typeof product.ecoScore === 'number' && (
          <span className="eco-pill">Eco {product.ecoScore.toFixed(1)}</span>
        )}
        <button className={`pcard-wish ${loved ? 'on' : ''}`} aria-label="Wishlist" onClick={() => toggleWishlist(product.id)}>
          {loved ? <Icon.heartFill /> : <Icon.heart />}
        </button>
      </div>
      <div className="pcard-body">
        <div className="pcard-brand">{product.brand}</div>
        <Link to={`/product/${product.id}`} className="pcard-name">
          {product.name}
        </Link>
        <div className="rating">
          <Icon.star /> {product.rating} · {(product.reviews || 0).toLocaleString('en-IN')}
        </div>
        <div className="price-row">
          <span className="price">{formatINR(product.price)}</span>
          <span className="mrp">{formatINR(product.mrp)}</span>
          <span className="off">{discountOf(product)}% off</span>
        </div>
        {why.length > 0 && (
          <ul className="why-mini">
            {why.slice(0, 2).map((w) => (
              <li key={w}>✓ {w}</li>
            ))}
          </ul>
        )}
        <div className="pcard-acts">
          <button
            className="btn btn-primary"
            type="button"
            style={{ height: 36, padding: '0 14px', fontSize: 13 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart(product.id)
            }}
          >
            Add to cart
          </button>
          {wishMove && (
            <button className="linkish" onClick={() => moveWishlistToBag(product.id)}>
              Move to cart
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
