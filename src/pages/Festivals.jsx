import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../data/products'
import { buildLook, crowdScore, upcomingFestivals, SLOT_LABEL } from '../lib/styleEngine'
import { useStore } from '../context/StoreContext'
import ProductImage from '../components/ProductImage'

export default function Festivals() {
  const { visibleProducts, addToCart } = useStore()
  const list = useMemo(() => upcomingFestivals(), [])

  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="eyebrow">Festival Radar</p>
        <h1>Dress the date, not just the catalogue.</h1>
        <p className="muted">
          Indian calendars run the closet. Trendora builds a complete look for the next festival — days left, budget cap,
          campus crowd score.
        </p>
      </div>
      {list.map((f) => {
        const look = buildLook(visibleProducts, { budget: f.budget, mood: f.mood, college: f.college })
        const score = crowdScore(look.items.map((p) => p.id))
        return (
          <article key={f.id} className="look-board" style={{ marginBottom: 18 }}>
            <div className="look-head">
              <div>
                <p className="eyebrow">{f.days <= 0 ? 'Today' : `${f.days} days left`}</p>
                <h2>{f.name}</h2>
                <p className="muted">{f.blurb} · Cap {formatINR(f.budget)} · Look {formatINR(look.total)}</p>
                <p className="crowd">Campus crowd score: {score}% would wear this</p>
              </div>
              <button className="btn btn-primary" type="button" onClick={() => look.items.forEach((p) => addToCart(p.id))}>
                Add this festival look
              </button>
            </div>
            <div className="look-slots">
              {look.items.map((p) => (
                <article key={p.id} className="look-slot">
                  <span className="slot-tag">{SLOT_LABEL[p.slot] || p.slot}</span>
                  <Link to={`/product/${p.id}`}>
                    <ProductImage src={p.image} alt={p.name} />
                  </Link>
                  <strong>{p.name}</strong>
                  <span>{formatINR(p.price)}</span>
                </article>
              ))}
            </div>
          </article>
        )
      })}
    </div>
  )
}
