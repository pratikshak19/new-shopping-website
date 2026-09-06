import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../data/products'
import { completeAround, crowdScore, SLOT_LABEL } from '../lib/styleEngine'
import { useStore } from '../context/StoreContext'
import ProductImage from '../components/ProductImage'

export default function Own() {
  const { visibleProducts, addToCart } = useStore()
  const [ownedId, setOwnedId] = useState('')
  const closet = visibleProducts.filter((p) =>
    ['women', 'men', 'footwear', 'electronics', 'home', 'beauty', 'kids'].includes(p.category)
  ).slice(0, 20)
  const owned = visibleProducts.find((p) => p.id === ownedId)
  const look = useMemo(() => completeAround(owned, visibleProducts, { budget: 1800 }), [owned, visibleProducts])
  const score = crowdScore(look.items.map((p) => p.id))

  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="eyebrow">Closet mixer</p>
        <h1>I already own this.</h1>
        <p className="muted">
        Pick anything you already have — a kurti, earbuds, a lamp. Trendora only sells the missing extras from the
        whole mall, under a spend cap.
        </p>
      </div>
      <div className="own-grid">
        {closet.map((p) => (
          <button key={p.id} type="button" className={`own-pick ${ownedId === p.id ? 'on' : ''}`} onClick={() => setOwnedId(p.id)}>
            <ProductImage src={p.image} alt={p.name} />
            <span>{p.name}</span>
          </button>
        ))}
      </div>
      {owned && (
        <div className="look-board" style={{ marginTop: 22 }}>
          <div className="look-head">
            <div>
              <p className="eyebrow">You keep {owned.name}</p>
              <h2>New extras — {formatINR(look.total)}</h2>
              <p className="muted">Owned piece is not added to cart. Crowd score {score}%.</p>
            </div>
            <button className="btn btn-primary" type="button" onClick={() => look.extras.forEach((p) => addToCart(p.id))}>
              Add only the extras
            </button>
          </div>
          <div className="look-slots">
            {look.items.map((p) => (
              <article key={p.id} className="look-slot">
                <span className="slot-tag">{p.id === owned.id ? 'You own' : SLOT_LABEL[p.slot] || p.slot}</span>
                <Link to={`/product/${p.id}`}>
                  <ProductImage src={p.image} alt={p.name} />
                </Link>
                <strong>{p.name}</strong>
                <span>{p.id === owned.id ? 'Already yours' : formatINR(p.price)}</span>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
