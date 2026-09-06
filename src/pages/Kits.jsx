import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../data/products'
import { LIFESTYLE_KITS, buildKit, SLOT_LABEL } from '../lib/styleEngine'
import { useStore } from '../context/StoreContext'
import ProductImage from '../components/ProductImage'

export default function Kits() {
  const { visibleProducts, addToCart } = useStore()
  const kits = useMemo(
    () => LIFESTYLE_KITS.map((k) => buildKit(visibleProducts, k)),
    [visibleProducts]
  )

  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="eyebrow">Full mall · not clothing-only</p>
        <h1>Lifestyle kits</h1>
        <p className="muted">
          Trendora is a complete shopping website: fashion, electronics, beauty, home, kids and stationery.
          Each kit mixes departments under one budget — something a clothes-only boutique cannot do.
        </p>
      </div>
      {kits.map((kit) => (
        <article key={kit.id} className="look-board" style={{ marginBottom: 18 }}>
          <div className="look-head">
            <div>
              <p className="eyebrow">Cap {formatINR(kit.budget)}</p>
              <h2>{kit.name}</h2>
              <p className="muted">{kit.blurb}</p>
              <p className="crowd">Crowd score {kit.score}% · kit total {formatINR(kit.total)}</p>
            </div>
            <button className="btn btn-primary" type="button" onClick={() => kit.items.forEach((p) => addToCart(p.id))}>
              Add full kit to cart
            </button>
          </div>
          <div className="look-slots">
            {kit.items.map((p) => (
              <article key={p.id} className="look-slot">
                <span className="slot-tag">{p.category} · {SLOT_LABEL[p.slot] || p.slot}</span>
                <Link to={`/product/${p.id}`}>
                  <ProductImage src={p.image} alt={p.name} />
                </Link>
                <strong>{p.name}</strong>
                <span>{formatINR(p.price)}</span>
              </article>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}
