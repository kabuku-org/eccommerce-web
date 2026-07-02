import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './pages/Auth/Login'
import { Signup } from './pages/Auth/Signup'
import ProtectedRoutes from './pages/Auth/ProtectedRoutes'
import { HomeUser } from './pages/Home'
import { Cart } from './pages/cart'



export function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       
       {/* Add protected routes here */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<HomeUser />} />
          <Route path="/cart" element={<Cart />} />
          {/* Dashboard features are now embedded in /home based on user role */}
          {/* Add more protected routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

