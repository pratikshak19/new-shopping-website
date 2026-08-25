import { useStore } from '../../context/StoreContext'

export default function ReturnsAdmin() {
  const { returns, setReturnStatus } = useStore()
  return (
    <div>
      <h1 className="serif" style={{ fontSize: 30 }}>
        Returns &amp; refunds
      </h1>
      <p className="muted">Myntra-style reverse pickup desk.</p>
      <div className="table-wrap">
        <table className="grid-table">
          <thead>
            <tr>
              <th>Return</th>
              <th>Order</th>
              <th>Reason</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {returns.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.orderId}</td>
                <td>{r.reason}</td>
                <td>{r.status}</td>
                <td>
                  {['Approved', 'Picked', 'Refunded'].filter((s) => s !== r.status).map((s) => (
                    <button key={s} className="linkish" onClick={() => setReturnStatus(r.id, s)}>
                      {s}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
            {returns.length === 0 && (
              <tr>
                <td colSpan={5}>No return requests. Deliver an order as admin, then request a return as customer.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
