import { Link } from 'react-router-dom'
import { discountOf, formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'
import { Icon } from './Icons'
import ProductImage from './ProductImage'

export default function ProductCard({ product, wishMove }) {
  const { wishlist, toggleWishlist, addToCart, shareProduct, user, moveWishlistToBag } = useStore()
  const loved = wishlist.includes(product.id)
  const tag = product.tags?.[0]
  return (
    <article className="pcard">
      <div className="pcard-img">
        <Link to={`/product/${product.id}`}>
          <ProductImage src={product.image} alt={product.name} />
        </Link>
        {tag && <span className={`tag ${tag}`}>{tag}</span>}
        <button className={`pcard-wish ${loved ? 'on' : ''}`} aria-label="Wishlist" onClick={() => toggleWishlist(product.id)}>
          {loved ? <Icon.heartFill /> : <Icon.heart />}
        </button>
        <button className="pcard-bag" onClick={() => addToCart(product.id)}>
          Add to bag
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
        <div className="pcard-acts">
          {wishMove && (
            <button className="linkish" onClick={() => moveWishlistToBag(product.id)}>
              Move to bag
            </button>
          )}
          {user?.role === 'reseller' && (
            <button className="linkish" onClick={() => shareProduct(product.id)}>
              Share & earn
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
