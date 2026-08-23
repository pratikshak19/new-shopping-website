import { useStore } from '../context/StoreContext'

export default function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
