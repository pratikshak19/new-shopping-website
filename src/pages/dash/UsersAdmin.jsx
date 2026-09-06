import { ROLE_META } from '../../data/products'
import { useStore } from '../../context/StoreContext'

export default function UsersAdmin() {
  const { users, setUserBlocked } = useStore()

  return (
    <div>
      <h1 className="serif" style={{ fontSize: 30 }}>
        Customers
      </h1>
      <p className="muted">This project has two account types only: Admin (you) and Customer (shoppers).</p>
      <div className="table-wrap">
        <table className="grid-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="role-pill" style={{ background: ROLE_META[u.role]?.color }}>
                    {u.role}
                  </span>
                </td>
                <td>{u.blocked ? 'Blocked' : 'Active'}</td>
                <td>
                  {u.role !== 'admin' && (
                    <button className="linkish" onClick={() => setUserBlocked(u.id, !u.blocked)}>
                      {u.blocked ? 'Unblock' : 'Block'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
