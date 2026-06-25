import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './pages/Auth/Login'
import { Signup } from './pages/Auth/Signup'
import ProtectedRoutes from './pages/Auth/ProtectedRoutes'
function Home() {
  return <div className="p-8">Home page — books go here next</div>
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       
       {/* Add protected routes here */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<div>Dashboard - Protected</div>} />
          {/* Add more protected routes as needed */}
        </Route>

      </Routes>
    </BrowserRouter>
  )
}