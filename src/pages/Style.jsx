import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../data/products'
import {
  MOODS,
  SLOT_LABEL,
  averageColorFromImage,
  buildLook,
  nearestColorName,
  parseStylePrompt,
  similarByColor,
  studentRail,
  whyRecommend,
} from '../lib/styleEngine'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'

const TABS = [
  ['ask', 'AI Style'],
  ['mood', 'Mood'],
  ['budget', 'Budget lock'],
  ['photo', 'Photo search'],
  ['student', 'Student'],
]

function LookBoard({ look, onAddAll }) {
  if (!look?.items?.length) {
    return (
      <div className="empty" style={{ padding: 36 }}>
        <h2>No complete look in this budget</h2>
        <p>Raise the budget or change the mood.</p>
      </div>
    )
  }
  return (
    <div className="look-board">
      <div className="look-head">
        <div>
          <p className="eyebrow">{look.title}</p>
          <h2>Complete look — {formatINR(look.total)}</h2>
          <p className="muted">Budget {formatINR(look.budget)} · leftover {formatINR(look.leftover)}</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={onAddAll}>
          Add full look to cart
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
            <ul className="why-list">
              {whyRecommend(p, { budget: look.budget, mood: look.mood, college: look.college }).map((w) => (
                <li key={w}>✓ {w}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}

export default function Style() {
  const { visibleProducts, addToCart, studentMode, setStudentMode, budgetLock, setBudgetLock, styleMood, setStyleMood } =
    useStore()
  const [tab, setTab] = useState('ask')
  const [prompt, setPrompt] = useState('I need a college outfit under Rs 1000.')
  const [parsed, setParsed] = useState(parseStylePrompt('college outfit under 1000'))
  const [budget, setBudget] = useState(budgetLock || 1500)
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoHits, setPhotoHits] = useState([])
  const [photoNote, setPhotoNote] = useState('')

  const look = useMemo(
    () =>
      buildLook(visibleProducts, {
        budget: parsed.budget,
        mood: parsed.mood,
        college: parsed.college || studentMode,
        gender: parsed.gender,
        eco: parsed.eco,
      }),
    [visibleProducts, parsed, studentMode]
  )

  const moodLook = useMemo(
    () => buildLook(visibleProducts, { budget: budgetLock || budget, mood: styleMood, college: studentMode }),
    [visibleProducts, budgetLock, budget, styleMood, studentMode]
  )

  const budgetLook = useMemo(
    () => buildLook(visibleProducts, { budget: budgetLock || budget, mood: styleMood, college: studentMode }),
    [visibleProducts, budgetLock, budget, styleMood, studentMode]
  )

  const campus = useMemo(() => studentRail(visibleProducts).slice(0, 12), [visibleProducts])

  const addLook = (items) => {
    items.forEach((p) => addToCart(p.id))
  }

  const onPhoto = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhotoUrl(url)
    const img = new Image()
    img.onload = () => {
      const rgb = averageColorFromImage(img)
      const name = nearestColorName(rgb)
      setPhotoNote(`Photo tone ≈ ${name}`)
      setPhotoHits(similarByColor(rgb, visibleProducts, 8))
    }
    img.src = url
  }

  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <p className="eyebrow">Personalized Smart Shopping</p>
        <h1>Style assistant</h1>
        <p className="muted">Type a wish, pick a mood, lock a budget, or upload a photo — Trendora builds a complete look.</p>
      </div>

      <div className="smart-bar">
        <label className={`chip ${studentMode ? 'on' : ''}`}>
          <input type="checkbox" checked={studentMode} onChange={(e) => setStudentMode(e.target.checked)} />
          Student Mode 🎓
        </label>
        <label className="budget-lock">
          My budget
          <input
            type="number"
            min="299"
            step="100"
            value={budgetLock || budget}
            onChange={(e) => {
              const n = Number(e.target.value) || 0
              setBudget(n)
              setBudgetLock(n)
            }}
          />
        </label>
      </div>

      <div className="style-tabs">
        {TABS.map(([id, label]) => (
          <button key={id} className={`chip ${tab === id ? 'on' : ''}`} type="button" onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'ask' && (
        <section className="style-panel">
          <form
            className="ask-box"
            onSubmit={(e) => {
              e.preventDefault()
              const next = parseStylePrompt(prompt)
              setParsed(next)
              setBudget(next.budget)
              setBudgetLock(next.budget)
              if (next.mood) setStyleMood(next.mood)
              if (next.college) setStudentMode(true)
            }}
          >
            <label>AI Style Assistant</label>
            <textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <button className="btn btn-primary" type="submit">
              Suggest complete outfit
            </button>
          </form>
          <LookBoard look={{ ...look, mood: parsed.mood, college: parsed.college }} onAddAll={() => addLook(look.items)} />
        </section>
      )}

      {tab === 'mood' && (
        <section className="style-panel">
          <div className="mood-grid">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`mood-card ${styleMood === m.id ? 'on' : ''}`}
                onClick={() => setStyleMood(m.id)}
              >
                <span>{m.emoji}</span>
                <strong>{m.label}</strong>
              </button>
            ))}
          </div>
          <LookBoard look={{ ...moodLook, mood: styleMood }} onAddAll={() => addLook(moodLook.items)} />
          <div className="prod-grid" style={{ marginTop: 22 }}>
            {visibleProducts
              .filter((p) => !styleMood || (p.moods || []).includes(styleMood))
              .slice(0, 8)
              .map((p) => (
                <ProductCard key={p.id} product={p} showWhy />
              ))}
          </div>
        </section>
      )}

      {tab === 'budget' && (
        <section className="style-panel">
          <p className="muted">Trendora will only build a complete look inside this budget.</p>
          <input
            className="range"
            type="range"
            min="500"
            max="8000"
            step="100"
            value={budgetLock || budget}
            onChange={(e) => {
              const n = Number(e.target.value)
              setBudget(n)
              setBudgetLock(n)
            }}
          />
          <LookBoard look={{ ...budgetLook, mood: styleMood }} onAddAll={() => addLook(budgetLook.items)} />
        </section>
      )}

      {tab === 'photo' && (
        <section className="style-panel">
          <div className="ask-box">
            <label>Find similar products</label>
            <p className="muted">Upload a dress photo. Trendora matches colour tone on this device — nothing is sent to a server.</p>
            <input type="file" accept="image/*" onChange={(e) => onPhoto(e.target.files?.[0])} />
            {photoUrl && <img src={photoUrl} alt="Uploaded reference" className="photo-ref" />}
            {photoNote && <p className="muted">{photoNote}</p>}
          </div>
          <div className="prod-grid">
            {photoHits.map((p) => (
              <ProductCard key={p.id} product={p} showWhy />
            ))}
          </div>
        </section>
      )}

      {tab === 'student' && (
        <section className="style-panel">
          <div className="student-hero">
            <div>
              <h2>Student Mode {studentMode ? 'ON' : 'OFF'} 🎓</h2>
              <p>Budget-friendly college outfits, bags, stationery, daily footwear. Coupon CAMPUS10.</p>
              <button className="btn btn-dark" type="button" onClick={() => setStudentMode(!studentMode)}>
                {studentMode ? 'Turn off' : 'Turn on Student Mode'}
              </button>
            </div>
          </div>
          <LookBoard
            look={{ ...buildLook(visibleProducts, { budget: Math.min(budgetLock || 1000, 1500), college: true, mood: styleMood || 'casual' }), college: true }}
            onAddAll={() =>
              addLook(buildLook(visibleProducts, { budget: Math.min(budgetLock || 1000, 1500), college: true, mood: styleMood || 'casual' }).items)
            }
          />
          <div className="prod-grid" style={{ marginTop: 22 }}>
            {campus.map((p) => (
              <ProductCard key={p.id} product={p} showWhy />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
