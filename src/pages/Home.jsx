import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'
import { Icon } from '../components/Icons'

const SLIDES = [
  {
    kicker: 'New season drop',
    title: 'Dress like the occasion found you.',
    text: 'Festive silks, city tailoring and everyday cottons — a Myntra-grade closet, without the maze.',
    cta: 'Shop fashion',
    to: '/shop?cat=women',
    image: '/images/hero-fashion.jpg',
  },
  {
    kicker: 'Tech week',
    title: 'Gadgets that keep up with campus life.',
    text: 'Phones, buds and notebooks with honest prices and next-day style delivery.',
    cta: 'Shop electronics',
    to: '/shop?cat=electronics',
    image: '/images/hero-electronics.jpg',
  },
  {
    kicker: 'Festival sale',
    title: 'Up to 60% off. Code FESTIVE20.',
    text: 'Stack festive discounts on already marked-down picks. Free delivery above ₹999.',
    cta: 'Grab deals',
    to: '/shop?tag=deal',
    image: '/images/hero-sale.jpg',
  },
]

function useCountdown(hours = 11) {
  const end = useMemo(() => Date.now() + hours * 3600 * 1000, [hours])
  const [left, setLeft] = useState(end - Date.now())
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, end - Date.now())), 1000)
    return () => clearInterval(t)
  }, [end])
  const h = String(Math.floor(left / 3600000)).padStart(2, '0')
  const m = String(Math.floor((left % 3600000) / 60000)).padStart(2, '0')
  const s = String(Math.floor((left % 60000) / 1000)).padStart(2, '0')
  return { h, m, s }
}

export default function Home() {
  const { visibleProducts, recent, getProduct } = useStore()
  const [i, setI] = useState(0)
  const slide = SLIDES[i]
  const t = useCountdown(14)
  const trending = visibleProducts.filter((p) => (p.tags || []).includes('bestseller')).slice(0, 8)
  const deals = visibleProducts.filter((p) => (p.tags || []).includes('deal') || (p.tags || []).includes('festive')).slice(0, 4)
  const viewed = recent.map(getProduct).filter(Boolean).slice(0, 4)

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <section className="hero">
        <div className="hero-slide">
          <div className="hero-copy">
            <div className="eyebrow">{slide.kicker}</div>
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" to={slide.to}>
                {slide.cta} <Icon.chev style={{ width: 16, height: 16 }} />
              </Link>
              <Link className="btn btn-ghost" to="/shop">
                Browse all
              </Link>
            </div>
          </div>
          <div className="hero-media">
            <img src={slide.image} alt="" />
          </div>
        </div>
        <div className="hero-dots">
          {SLIDES.map((s, n) => (
            <button key={s.title} className={n === i ? 'on' : ''} onClick={() => setI(n)} aria-label={s.kicker} />
          ))}
        </div>
      </section>

      <section className="sec wrap">
        <div className="trust">
          <article>
            <Icon.truck />
            <div>
              <h3>Free delivery ₹999+</h3>
              <p>Across 19,000+ pin codes. COD available.</p>
            </div>
          </article>
          <article>
            <Icon.return />
            <div>
              <h3>7-day easy returns</h3>
              <p>Changed your mind? Send it back, no drama.</p>
            </div>
          </article>
          <article>
            <Icon.shield />
            <div>
              <h3>Secure checkout</h3>
              <p>UPI, cards and COD — all simulated for this project.</p>
            </div>
          </article>
          <article>
            <Icon.pin />
            <div>
              <h3>Village to metro</h3>
              <p>Built as a campus project that still feels national.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <div className="sec-head">
          <div>
            <p>Departments</p>
            <h2>Shop by category</h2>
          </div>
          <Link className="link-more" to="/shop">
            View all <Icon.chev />
          </Link>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/shop?cat=${c.id}`}>
              <figure className="cat-card">
                <img src={c.image} alt={c.name} />
                <figcaption>
                  <h3>{c.name}</h3>
                  <span>{c.blurb}</span>
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 64 }}>
        <div className="deals">
          <div>
            <div className="eyebrow">Deal of the day</div>
            <h2>Ends tonight</h2>
            <p style={{ color: '#d7c8c0', fontSize: 14 }}>
              Flash prices on tech and festive wear. Timer resets every visit for the demo.
            </p>
            <div className="timer">
              <b>
                {t.h}
                <span>hrs</span>
              </b>
              <b>
                {t.m}
                <span>min</span>
              </b>
              <b>
                {t.s}
                <span>sec</span>
              </b>
            </div>
          </div>
          <div className="prod-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            {deals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <div className="sec-head">
          <div>
            <p>Loved this week</p>
            <h2>Bestsellers</h2>
          </div>
          <Link className="link-more" to="/shop">
            Shop trending <Icon.chev />
          </Link>
        </div>
        <div className="prod-grid">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {viewed.length > 0 && (
        <section className="sec wrap" style={{ paddingTop: 0 }}>
          <div className="sec-head">
            <h2>Recently viewed</h2>
          </div>
          <div className="prod-grid">
            {viewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <div className="brand-row">
          <Link className="chip" to="/offers">Bank &amp; coupon offers</Link>
          <Link className="chip" to="/insider">Trendora Insider</Link>
          <Link className="chip" to="/brands">Shop by brand</Link>
          <Link className="chip" to="/studio">Studio looks</Link>
          <Link className="chip" to="/compare">Compare</Link>
          <Link className="chip" to="/login">4 role logins</Link>
        </div>
      </section>
    </>
  )
}
