import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CATEGORIES, COLLECTIONS } from '../../data/products'
import { useStore } from '../../context/StoreContext'

const PHOTOS = [
  '/images/products/scarlet-sequin-gown.jpg',
  '/images/products/emerald-bridal-lehenga.jpg',
  '/images/products/midnight-tuxedo.jpg',
  '/images/products/ivory-sherwani.jpg',
  '/images/products/pastel-organza-anarkali.jpg',
  '/images/products/ivory-pantsuit.jpg',
  '/images/products/sage-linen-suit.jpg',
  '/images/products/rose-tulle-party-dress.jpg',
  '/images/products/maroon-velvet-wrap-dress.jpg',
  '/images/products/indigo-handblock-saree.jpg',
  '/images/products/mustard-mirror-kurta-set.jpg',
  '/images/products/black-satin-slip-dress.jpg',
  '/images/products/olive-cargo-trousers.jpg',
  '/images/products/white-chikankari-kurti.jpg',
  '/images/products/coral-pleated-maxi-skirt.jpg',
  '/images/products/washed-Denim Denim Jacket.jpg',
  '/images/products/charcoal-formal-trousers.jpg',
  '/images/products/olive-bomber-jacket.jpg',
  '/images/products/yellow-kids-raincoat.jpg',
  '/images/products/blue-kids-dungaree-set.jpg',
  '/images/products/pink-polka-frock.jpg',
  '/images/products/green-dino-kids-set.jpg',
  '/images/products/red-kids-puffer.jpg',
  '/images/products/black-headphones.jpg',
  '/images/products/gaming-keyboard.jpg',
  '/images/products/action-camera.jpg',
  '/images/products/mini-projector.jpg',
  '/images/products/fitness-band.jpg',
  '/images/products/blue-star-pyjama-set.jpg',
  '/images/products/orange-kids-kurta-set.jpg',
  '/images/products/lavender-unicorn-sweatshirt.jpg',
  '/images/products/usbc-fast-charger.jpg',
  '/images/products/grey-wireless-mouse.jpg',
  '/images/products/tablet-with-stylus.jpg',
  '/images/products/striped-king-bedsheet.jpg',
  '/images/products/sage-dinner-set.jpg',
  '/images/products/amber-soy-candles.jpg',
  '/images/products/walnut-wall-shelves.jpg',
  '/images/products/teal-towel-set.jpg',
  '/images/products/black-nonstick-Kadhai.jpg',
  '/images/products/rust-throw-blanket.jpg',
  '/images/products/beige-cotton-curtains.jpg',
  '/images/products/matte-lipstick-set.jpg',
  '/images/products/vitamin-c-serum.jpg',
  '/images/products/rose-quartz-roller-set.jpg',
  '/images/products/waterproof-mascara.jpg',
  '/images/products/argan-hair-serum.jpg',
  '/images/products/compact-blush-duo.jpg',
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
  collection: 'new-season',
  listingType: 'buy',
  rentPerDay: 299,
  rentalDeposit: 1000,
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
      const { collection, listingType, rentPerDay, rentalDeposit, ...baseForm } = form
      const created = upsertProduct({
        ...baseForm,
        price: +form.price,
        mrp: +form.mrp,
        stock: +form.stock,
        colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        gallery: [form.image],
        tags: ['new'],
        collections: [collection],
        rentalOnly: listingType === 'rent-only',
        rental:
          listingType === 'buy'
            ? false
            : {
                perDay: Math.max(1, +rentPerDay || 299),
                deposit: Math.max(0, +rentalDeposit || 0),
                minDays: 2,
                maxDays: 10,
                occasions: ['Special occasion'],
              },
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
              <div className="split">
                <div className="field">
                  <label>Collection</label>
                  <select value={form.collection} onChange={set('collection')}>
                    {COLLECTIONS.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Listing type</label>
                  <select value={form.listingType} onChange={set('listingType')}>
                    <option value="buy">Buy only</option>
                    <option value="buy-rent">Buy + Rent</option>
                    <option value="rent-only">Rent only</option>
                  </select>
                </div>
              </div>
              {form.listingType !== 'buy' && (
                <div className="split">
                  <div className="field">
                    <label>Rent per day (₹)</label>
                    <input type="number" min="1" value={form.rentPerDay} onChange={set('rentPerDay')} />
                  </div>
                  <div className="field">
                    <label>Refundable deposit (₹)</label>
                    <input type="number" min="0" value={form.rentalDeposit} onChange={set('rentalDeposit')} />
                  </div>
                </div>
              )}
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
        <li>Sign in as <strong>admin@trendify.in / admin123</strong>.</li>
        <li>Admin desk → Add a new item (this page).</li>
        <li>Fill name + brand → Next → price/stock → Next → pick photo → Publish.</li>
        <li>Open Shop — the new card appears at the top (tag: new).</li>
      </ol>
    </div>
  )
}
