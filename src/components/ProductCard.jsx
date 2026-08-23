import { Link } from 'react-router-dom'
import { discountOf, formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'
import { Icon } from './Icons'
import ProductImage from './ProductImage'

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist } = useStore()
  const loved = wishlist.includes(product.id)
  const tag = product.tags?.[0]
  return (
    <article className="pcard">
      <div className="pcard-img">
        <Link to={`/product/${product.id}`}>
          <ProductImage src={product.image} alt={product.name} />
        </Link>
        {tag && <span className={`tag ${tag}`}>{tag}</span>}
        <button
          className={`pcard-wish ${loved ? 'on' : ''}`}
          aria-label="Wishlist"
          onClick={() => toggleWishlist(product.id)}
        >
          {loved ? <Icon.heartFill /> : <Icon.heart />}
        </button>
      </div>
      <div className="pcard-body">
        <div className="pcard-brand">{product.brand}</div>
        <Link to={`/product/${product.id}`} className="pcard-name">
          {product.name}
        </Link>
        <div className="rating">
          <Icon.star /> {product.rating} · {product.reviews.toLocaleString('en-IN')}
        </div>
        <div className="price-row">
          <span className="price">{formatINR(product.price)}</span>
          <span className="mrp">{formatINR(product.mrp)}</span>
          <span className="off">{discountOf(product)}% off</span>
        </div>
      </div>
    </article>
  )
}
