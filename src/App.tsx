import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './pages/Auth/Login'
import { Signup } from './pages/Auth/Signup'
import ProtectedRoutes from './pages/Auth/ProtectedRoutes'
import { HomeUser } from './pages/Home'
import { Cart } from './pages/cart'
import { Order } from './pages/order'
import { ReviewsOrderPage } from './pages/ReviewsOrderPage'
import { CustomersPage } from './pages/CustomersPage'
import { CancelledOrdersPage } from './pages/CancelledOrdersPage'
import { Dashboard } from './pages/Auth/DashBoard'
import { AdminProductsPage } from './pages/Auth/AdminProductsPage'


export function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<HomeUser />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
       
       {/* Add protected routes here */}
        <Route element={<ProtectedRoutes />}>
          
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/reviews" element={<ReviewsOrderPage />} />
          <Route path="/admin/orders" element={<CancelledOrdersPage />} />
          <Route path="/admin/cancelled-orders" element={<CancelledOrdersPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/customers" element={<CustomersPage />} />
          {/* Add more protected routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}