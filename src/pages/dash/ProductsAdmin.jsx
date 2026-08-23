import { useState } from 'react'
import { CATEGORIES, formatINR } from '../../data/products'
import { useStore } from '../../context/StoreContext'

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
  image: '/images/cat-women.jpg',
}

export default function ProductsAdmin({ role }) {
  const { products, user, upsertProduct, removeProduct } = useStore()
  const [form, setForm] = useState(blank)
  const [edit, setEdit] = useState(null)
  const list = role === 'seller' ? products.filter((p) => p.sellerId === user.id && p.status !== 'hidden') : products.filter((p) => p.status !== 'hidden')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    upsertProduct({
      ...(edit || {}),
      ...form,
      price: +form.price,
      mrp: +form.mrp,
      stock: +form.stock,
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      gallery: [form.image],
    })
    setForm(blank)
    setEdit(null)
  }

  const startEdit = (p) => {
    setEdit(p)
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      mrp: p.mrp,
      stock: p.stock,
      description: p.description,
      colors: (p.colors || []).join(', '),
      sizes: (p.sizes || []).join(', '),
      image: p.image,
    })
  }

  return (
    <div>
      <h1 className="serif" style={{ fontSize: 30 }}>
        Catalogue
      </h1>
      <p className="muted">Add, edit or hide SKUs — Meesho supplier style listing.</p>
      <form className="dash-form" onSubmit={submit}>
        <div className="field">
          <label>Name</label>
          <input value={form.name} onChange={set('name')} required />
        </div>
        <div className="split">
          <div className="field">
            <label>Brand</label>
            <input value={form.brand} onChange={set('brand')} required />
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
        <div className="split">
          <div className="field">
            <label>Price</label>
            <input type="number" value={form.price} onChange={set('price')} />
          </div>
          <div className="field">
            <label>MRP</label>
            <input type="number" value={form.mrp} onChange={set('mrp')} />
          </div>
          <div className="field">
            <label>Stock</label>
            <input type="number" value={form.stock} onChange={set('stock')} />
          </div>
        </div>
        <div className="field">
          <label>Colours (comma)</label>
          <input value={form.colors} onChange={set('colors')} />
        </div>
        <div className="field">
          <label>Sizes (comma)</label>
          <input value={form.sizes} onChange={set('sizes')} />
        </div>
        <div className="field">
          <label>Image path</label>
          <input value={form.image} onChange={set('image')} />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={3} value={form.description} onChange={set('description')} />
        </div>
        <button className="btn btn-primary" type="submit">
          {edit ? 'Update SKU' : 'List product'}
        </button>
        {edit && (
          <button className="btn btn-ghost" type="button" onClick={() => { setEdit(null); setForm(blank) }}>
            Cancel
          </button>
        )}
      </form>
      <div className="table-wrap">
        <table className="grid-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.name}
                  <div className="muted">{p.brand}</div>
                </td>
                <td>{formatINR(p.price)}</td>
                <td>{p.stock}</td>
                <td>
                  <button className="linkish" onClick={() => startEdit(p)}>
                    Edit
                  </button>{' '}
                  <button className="linkish" onClick={() => removeProduct(p.id)}>
                    Hide
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
