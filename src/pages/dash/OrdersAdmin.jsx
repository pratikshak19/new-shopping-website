import { formatINR } from '../../data/products'
import { useStore } from '../../context/StoreContext'

const FLOW = ['Confirmed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered']

export default function OrdersAdmin({ role }) {
  const { orders, user, setOrderStatus, cancelOrder } = useStore()
  const list =
    role === 'seller' ? orders.filter((o) => o.items.some((i) => i.sellerId === user.id)) : orders

  return (
    <div>
      <h1 className="serif" style={{ fontSize: 30 }}>
        Orders
      </h1>
      <p className="muted">Move the pipeline the way a Flipkart warehouse desk would.</p>
      <div className="table-wrap">
        <table className="grid-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer PIN</th>
              <th>Status</th>
              <th>Total</th>
              <th>Advance</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id}>
                <td>
                  <strong>{o.id}</strong>
                  <div className="muted">{new Date(o.placedAt).toLocaleString('en-IN')}</div>
                  <div className="muted">{o.items.map((i) => i.name).join(', ')}</div>
                </td>
                <td>{o.address?.pin}</td>
                <td>{o.status}</td>
                <td>{formatINR(o.totals.grand)}</td>
                <td>
                  {FLOW.filter((s) => FLOW.indexOf(s) > FLOW.indexOf(o.status)).slice(0, 1).map((s) => (
                    <button key={s} className="btn btn-ghost" style={{ height: 34, marginBottom: 6 }} onClick={() => setOrderStatus(o.id, s)}>
                      Mark {s}
                    </button>
                  ))}
                  {!['Cancelled', 'Delivered', 'Returned', 'Shipped', 'Out for delivery'].includes(o.status) && (
                    <button className="linkish" onClick={() => cancelOrder(o.id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5}>No orders in this console yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
