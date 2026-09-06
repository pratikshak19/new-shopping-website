import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BANK_OFFERS, CATEGORIES, formatINR } from '../data/products'
import { buildLook, upcomingFestivals } from '../lib/styleEngine'
import { useStore } from '../context/StoreContext'
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
  const day = new Date().getDate()
  const dailyMood = ['casual', 'cute', 'traditional', 'minimal', 'party', 'aesthetic', 'formal'][day % 7]
  const todayLook = useMemo(
    () => buildLook(visibleProducts, { budget: 1499, mood: dailyMood, college: true }),
    [visibleProducts, dailyMood]
  )
  const nextFest = upcomingFestivals()[0]

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
              <Link className="btn btn-ghost" to="/quiz">
                60-second quiz
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

      <section className="wrap" style={{ padding: '28px 0 0' }}>
        <div className="why-visit">
          <article>
            <p className="eyebrow">Why visit Trendora</p>
            <h2>A full shopping website that still thinks.</h2>
            <p className="muted">
              Fashion, electronics, beauty, home, kids and stationery in one mall. Other clones only list SKUs.
              Trendora builds kits across departments — campus starter, glow kit, room refresh, tech drop — under one budget.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
              <Link className="btn btn-primary" to="/kits">Shop lifestyle kits</Link>
              <Link className="btn btn-ghost" to="/quiz">Style quiz</Link>
              <Link className="btn btn-ghost" to="/own">I already own this</Link>
              <Link className="btn btn-ghost" to="/festivals">Festival radar</Link>
            </div>
          </article>
          <article className="today-look">
            <p className="eyebrow">Look of the day</p>
            <h3>{todayLook.title} · {formatINR(todayLook.total)}</h3>
            <p className="muted">Changes every calendar day. Built for a campus budget.</p>
            <div className="today-thumbs">
              {todayLook.items.slice(0, 4).map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} title={p.name}>
                  <img src={p.image} alt={p.name} />
                </Link>
              ))}
            </div>
            <Link className="link-more" to="/quiz">Get my look →</Link>
          </article>
        </div>
      </section>

      {nextFest && (
        <section className="wrap" style={{ padding: '18px 0 0' }}>
          <Link to="/festivals" className="fest-banner">
            <div>
              <p className="eyebrow">Next on the calendar</p>
              <h3>{nextFest.name} · {nextFest.days <= 0 ? 'today' : `${nextFest.days} days left`}</h3>
              <p>{nextFest.blurb} A complete look is waiting — not a random sale tile.</p>
            </div>
            <span className="btn btn-dark">Open Festival Radar</span>
          </Link>
        </section>
      )}

      <section className="wrap" style={{ padding: '28px 0 0' }}>
        <Link to="/style" className="smart-home">
          <div>
            <p className="eyebrow">Personalized Smart Shopping</p>
            <h2>AI Style Assistant</h2>
            <p>College outfit under ₹1000, mood looks, budget lock, photo search, Student Mode.</p>
          </div>
          <span className="btn btn-primary">Open Style</span>
        </Link>
      </section>

      <section className="wrap" style={{ padding: '18px 0 0' }}>
        <div className="bank-strip">
          {BANK_OFFERS.map((b) => (
            <Link key={b.bank} to="/offers" className="bank-pill">
              <b>{b.bank}</b> {b.text}
            </Link>
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
        <div className="editorial">
          <article>
            <p className="eyebrow" style={{ color: 'var(--rose)' }}>Studio edit</p>
            <h3>Looks, not just listings.</h3>
            <p className="muted">
              Trendora is built like a fashion magazine that also checks out. Open Studio for editorials
              or Insider for points. Shopping is for customers only.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
              <Link className="btn btn-dark" to="/studio">Open Studio</Link>
              <Link className="btn btn-ghost" to="/insider">Insider perks</Link>
            </div>
          </article>
          <Link to="/studio" className="lookbook">
            <img src="/images/hero-fashion.jpg" alt="Studio lookbook" />
            <span>New season lookbook →</span>
          </Link>
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <div className="brand-row">
          <Link className="chip" to="/offers">Bank &amp; coupon offers</Link>
          <Link className="chip" to="/insider">Trendora Insider</Link>
          <Link className="chip" to="/brands">Shop by brand</Link>
          <Link className="chip" to="/studio">Studio looks</Link>
          <Link className="chip" to="/compare">Compare</Link>
          <Link className="chip" to="/login">Sign in</Link>
        </div>
      </section>
    </>
  )
}
