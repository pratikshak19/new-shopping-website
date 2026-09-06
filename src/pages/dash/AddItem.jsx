import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../../data/products'
import { useStore } from '../../context/StoreContext'

const PHOTOS = [
  '/images/products/dress.jpg',
  '/images/products/saree.jpg',
  '/images/products/kurta.jpg',
  '/images/products/coord.jpg',
  '/images/products/shirt.jpg',
  '/images/products/jeans.jpg',
  '/images/products/sneakers.jpg',
  '/images/products/earbuds.jpg',
  '/images/products/phone.jpg',
  '/images/products/skincare.jpg',
  '/images/cat-women.jpg',
  '/images/cat-home.jpg',
]

const blank = {
  name: '',
  brand: '',
  category: 'women',
  price: 999,
  mrp: 1499,
  stock: 10,
  description: '',
  colors: 'Black, White',
  sizes: 'S, M, L',
  image: PHOTOS[0],
}

export default function AddItem() {
  const { upsertProduct, user } = useStore()
  const base = '/admin'
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(blank)
  const [id, setId] = useState('')
  const nav = useNavigate()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const next = (e) => {
    e.preventDefault()
    if (step === 1 && (!form.name.trim() || !form.brand.trim())) return
    if (step < 3) setStep((s) => s + 1)
    else {
      const created = upsertProduct({
        ...form,
        price: +form.price,
        mrp: +form.mrp,
        stock: +form.stock,
        colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        gallery: [form.image],
        tags: ['new'],
      })
      setId(created)
      setStep(4)
    }
  }

  return (
    <div>
      <p className="eyebrow">Admin only</p>
      <h1 className="serif" style={{ fontSize: 32 }}>
        Add a new item
      </h1>
      <p className="muted" style={{ maxWidth: 620 }}>
        Three steps. After publish the product appears on Shop. Photo upload has no server — pick a ready image for the college demo.
      </p>
      <div className="steps" style={{ maxWidth: 560, marginTop: 18 }}>
        {['Basics', 'Price & stock', 'Photo', 'Done'].map((label, i) => (
          <div key={label} className={`step ${step >= i + 1 ? 'on' : ''}`}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {step < 4 && (
        <form className="dash-form" onSubmit={next} style={{ maxWidth: 640 }}>
          {step === 1 && (
            <>
              <div className="field">
                <label>Item name</label>
                <input value={form.name} onChange={set('name')} placeholder="e.g. Cotton everyday kurta" required />
              </div>
              <div className="split">
                <div className="field">
                  <label>Brand</label>
                  <input value={form.brand} onChange={set('brand')} placeholder="Your label" required />
                </div>
                <div className="field">
                  <label>Category</label>
                  <select value={form.category} onChange={set('category')}>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Short description</label>
                <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Fabric, fit, occasion..." />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="split">
                <div className="field">
                  <label>Selling price (₹)</label>
                  <input type="number" min="1" value={form.price} onChange={set('price')} required />
                </div>
                <div className="field">
                  <label>MRP (₹)</label>
                  <input type="number" min="1" value={form.mrp} onChange={set('mrp')} />
                </div>
                <div className="field">
                  <label>Stock qty</label>
                  <input type="number" min="0" value={form.stock} onChange={set('stock')} />
                </div>
              </div>
              <div className="field">
                <label>Colours (comma separated)</label>
                <input value={form.colors} onChange={set('colors')} />
              </div>
              <div className="field">
                <label>Sizes (comma separated)</label>
                <input value={form.sizes} onChange={set('sizes')} />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <p className="muted">Click a photo. Selected one gets a rose ring.</p>
              <div className="photo-pick">
                {PHOTOS.map((src) => (
                  <button
                    type="button"
                    key={src}
                    className={form.image === src ? 'on' : ''}
                    onClick={() => setForm((f) => ({ ...f, image: src }))}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            </>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            {step > 1 && (
              <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            <button className="btn btn-primary" type="submit">
              {step === 3 ? 'Publish item' : 'Next'}
            </button>
          </div>
        </form>
      )}

      {step === 4 && (
        <div className="dash-form" style={{ maxWidth: 520 }}>
          <h2 className="serif">Item is live</h2>
          <p>
            SKU <strong>{id}</strong> is on the shop. Open it as a customer, or add another.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
            <Link className="btn btn-primary" to={`/product/${id}`}>
              View on store
            </Link>
            <Link className="btn btn-dark" to={`${base}/products`}>
              Catalogue
            </Link>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setForm(blank)
                setStep(1)
                setId('')
              }}
            >
              Add one more
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => nav(base)}>
              Desk home
            </button>
          </div>
        </div>
      )}

      <ol className="plain-list" style={{ marginTop: 22, maxWidth: 640 }}>
        <li>Sign in as <strong>admin@trendora.in / admin123</strong>.</li>
        <li>Admin desk → Add a new item (this page).</li>
        <li>Fill name + brand → Next → price/stock → Next → pick photo → Publish.</li>
        <li>Open Shop — the new card appears at the top (tag: new).</li>
      </ol>
    </div>
  )
}
