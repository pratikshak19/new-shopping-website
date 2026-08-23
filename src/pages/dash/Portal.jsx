import { Route, Routes } from 'react-router-dom'
import DashLayout from '../../components/DashLayout'
import Overview from './Overview'
import ProductsAdmin from './ProductsAdmin'
import OrdersAdmin from './OrdersAdmin'
import UsersAdmin from './UsersAdmin'
import CouponsAdmin from './CouponsAdmin'
import ReturnsAdmin from './ReturnsAdmin'
import TicketsAdmin from './TicketsAdmin'
import SettingsAdmin from './SettingsAdmin'
import ReportsAdmin from './ReportsAdmin'
import SellerEarnings from './SellerEarnings'

export default function Portal({ role }) {
  return (
    <DashLayout role={role}>
      <Routes>
        <Route index element={<Overview role={role} />} />
        <Route path="products" element={<ProductsAdmin role={role} />} />
        <Route path="orders" element={<OrdersAdmin role={role} />} />
        <Route path="users" element={<UsersAdmin role={role} />} />
        <Route path="coupons" element={<CouponsAdmin />} />
        <Route path="returns" element={<ReturnsAdmin />} />
        <Route path="tickets" element={<TicketsAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
        <Route path="reports" element={<ReportsAdmin />} />
        <Route path="earnings" element={<SellerEarnings />} />
      </Routes>
    </DashLayout>
  )
}
