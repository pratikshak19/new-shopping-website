import { useStore } from '../context/StoreContext'

export default function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="toasts" aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} role="status">
          {t.message}
        </div>
      ))}
    </div>
  )
}
