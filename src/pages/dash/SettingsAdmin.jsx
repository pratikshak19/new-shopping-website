import { useState } from 'react'
import { useStore } from '../../context/StoreContext'

export default function SettingsAdmin() {
  const { settings, setSettings, toast } = useStore()
  const [form, setForm] = useState(settings)
  return (
    <div>
      <h1 className="serif" style={{ fontSize: 30 }}>
        Owner settings
      </h1>
      <p className="muted">Only the owner can change commission, shipping and the announcement bar.</p>
      <form
        className="dash-form"
        onSubmit={(e) => {
          e.preventDefault()
          setSettings({
            ...form,
            freeShipMin: +form.freeShipMin,
            shipFee: +form.shipFee,
            commission: +form.commission,
            returnDays: +form.returnDays,
          })
          toast('Settings saved')
        }}
      >
        {[
          ['storeName', 'Store name'],
          ['announcement', 'Announcement bar'],
          ['freeShipMin', 'Free-ship minimum'],
          ['shipFee', 'Shipping fee'],
          ['commission', 'Seller commission %'],
          ['returnDays', 'Return window (days)'],
        ].map(([k, label]) => (
          <div className="field" key={k}>
            <label>{label}</label>
            <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </div>
        ))}
        <button className="btn btn-primary" type="submit">
          Save policy
        </button>
      </form>
    </div>
  )
}
