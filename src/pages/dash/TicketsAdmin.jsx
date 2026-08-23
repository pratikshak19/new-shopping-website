import { useStore } from '../../context/StoreContext'

export default function TicketsAdmin() {
  const { tickets, replyTicket } = useStore()
  return (
    <div>
      <h1 className="serif" style={{ fontSize: 30 }}>
        Help desk
      </h1>
      {tickets.map((t) => (
        <article key={t.id} className="ticket">
          <strong>{t.subject}</strong>
          <p className="muted">
            {t.name} · {t.status} · {new Date(t.at).toLocaleString('en-IN')}
          </p>
          <p>{t.message}</p>
          {t.reply && <p><em>Reply:</em> {t.reply}</p>}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const reply = new FormData(e.target).get('reply')
              replyTicket(t.id, reply)
              e.target.reset()
            }}
          >
            <input name="reply" placeholder="Type a reply" required style={{ width: '70%', marginRight: 8 }} />
            <button className="btn btn-ghost" type="submit">
              Send
            </button>
          </form>
        </article>
      ))}
      {tickets.length === 0 && <p>No tickets. Customers open them from Help.</p>}
    </div>
  )
}
