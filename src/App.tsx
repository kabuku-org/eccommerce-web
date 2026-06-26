import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './pages/Auth/Login'
import { Signup } from './pages/Auth/Signup'
import ProtectedRoutes from './pages/Auth/ProtectedRoutes'
import {HomeUser} from './pages/Home'

import { Cart } from './pages/cart'
import { Dashboard} from './pages/Auth/DashBoard'



export function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       
       {/* Add protected routes here */}
       
          <Route path="/home" element={<HomeUser />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more protected routes as needed */}
        

      </Routes>
    </BrowserRouter>
  )
}