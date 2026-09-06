import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../data/products'
import { buildLook, whyRecommend, SLOT_LABEL } from '../lib/styleEngine'
import { useStore } from '../context/StoreContext'
import ProductImage from '../components/ProductImage'

const STEPS = [
  {
    key: 'occasion',
    q: 'Where are you going?',
    options: [
      { id: 'college', label: 'College / class', college: true, mood: 'casual' },
      { id: 'fest', label: 'Fest / party', mood: 'party' },
      { id: 'pooja', label: 'Family / festive', mood: 'traditional' },
      { id: 'interview', label: 'Interview / formal', mood: 'formal' },
    ],
  },
  {
    key: 'budget',
    q: 'What is your budget?',
    options: [
      { id: '800', label: 'Under ₹800', budget: 800 },
      { id: '1500', label: 'Under ₹1,500', budget: 1500 },
      { id: '2500', label: 'Under ₹2,500', budget: 2500 },
      { id: '5000', label: 'Treat myself', budget: 5000 },
    ],
  },
  {
    key: 'vibe',
    q: 'What vibe do you want?',
    options: [
      { id: 'cute', label: 'Cute', mood: 'cute' },
      { id: 'minimal', label: 'Minimal', mood: 'minimal' },
      { id: 'aesthetic', label: 'Aesthetic', mood: 'aesthetic' },
      { id: 'keep', label: 'Keep occasion vibe', mood: '' },
    ],
  },
  {
    key: 'who',
    q: 'Who is this look for?',
    options: [
      { id: 'women', label: 'Women', gender: 'women' },
      { id: 'men', label: 'Men', gender: 'men' },
    ],
  },
]

export default function Quiz() {
  const { visibleProducts, addToCart, toast } = useStore()
  const [step, setStep] = useState(0)
  const [ans, setAns] = useState({})

  const pick = (opt) => {
    const key = STEPS[step].key
    const next = { ...ans, [key]: opt }
    setAns(next)
    setStep((s) => Math.min(s + 1, STEPS.length))
  }

  const done = step >= STEPS.length
  const look = useMemo(() => {
    if (!done) return null
    const budget = ans.budget?.budget || 1500
    const mood = ans.vibe?.mood || ans.occasion?.mood || 'casual'
    const college = Boolean(ans.occasion?.college)
    const gender = ans.who?.gender || 'women'
    return buildLook(visibleProducts, { budget, mood, college, gender })
  }, [done, ans, visibleProducts])

  const share = () => {
    if (!look?.items?.length) return
    const lines = look.items.map((p) => `• ${p.name} — ${formatINR(p.price)}`).join('\n')
    const text = `My Trendora look (${formatINR(look.total)})\n${lines}\nhttps://trendora.shop/quiz`
    navigator.clipboard?.writeText(text).catch(() => {})
    toast('Look copied — paste it to a friend')
  }

  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="eyebrow">60-second Style Quiz</p>
        <h1>Tell us the day. We dress it.</h1>
        <p className="muted">Four taps. One complete outfit. This is what Myntra does not do for a campus budget.</p>
      </div>

      {!done ? (
        <section className="quiz-panel">
          <p className="muted">
            Step {step + 1} of {STEPS.length}
          </p>
          <h2>{STEPS[step].q}</h2>
          <div className="mood-grid" style={{ marginTop: 18 }}>
            {STEPS[step].options.map((opt) => (
              <button key={opt.id} type="button" className="mood-card" onClick={() => pick(opt)}>
                <strong>{opt.label}</strong>
              </button>
            ))}
          </div>
          {step > 0 && (
            <button className="linkish" type="button" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}
        </section>
      ) : (
        <section>
          <div className="look-board">
            <div className="look-head">
              <div>
                <p className="eyebrow">Your look</p>
                <h2>Complete look — {formatINR(look?.total || 0)}</h2>
                <p className="muted">
                  {ans.occasion?.label} · {ans.vibe?.label} · {formatINR(ans.budget?.budget || 0)}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" type="button" onClick={() => look?.items.forEach((p) => addToCart(p.id))}>
                  Add full look to cart
                </button>
                <button className="btn btn-ghost" type="button" onClick={share}>
                  Share with a friend
                </button>
              </div>
            </div>
            <div className="look-slots">
              {(look?.items || []).map((p) => (
                <article key={p.id} className="look-slot">
                  <span className="slot-tag">{SLOT_LABEL[p.slot] || p.slot}</span>
                  <Link to={`/product/${p.id}`}>
                    <ProductImage src={p.image} alt={p.name} />
                  </Link>
                  <strong>{p.name}</strong>
                  <span>{formatINR(p.price)}</span>
                  <ul className="why-list">
                    {whyRecommend(p, {
                      budget: ans.budget?.budget,
                      mood: ans.vibe?.mood || ans.occasion?.mood,
                      college: ans.occasion?.college,
                    }).map((w) => (
                      <li key={w}>✓ {w}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          <p style={{ marginTop: 16 }}>
            <button className="linkish" type="button" onClick={() => { setStep(0); setAns({}) }}>
              Retake quiz
            </button>
            {' · '}
            <Link to="/style">Open full Style Assistant</Link>
          </p>
        </section>
      )}
    </div>
  )
}
