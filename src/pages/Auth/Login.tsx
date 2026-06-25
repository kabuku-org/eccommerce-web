import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loginLoading, loginError } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm border border-stone-200"
      >
        <h1 className="text-2xl font-semibold text-stone-900 mb-6">Log in</h1>

        <div className="mb-4">
          <label className="block text-sm text-stone-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-stone-600 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        {loginError && (
          <p className="text-red-600 text-sm mb-4">
            Invalid email or password.
          </p>
        )}

        <button
          type="submit"
          disabled={loginLoading}
          className="w-full bg-stone-900 text-white py-2 rounded-md hover:bg-stone-800 disabled:opacity-50"
        >
          {loginLoading ? 'Logging in...' : 'Log in'}
        </button>

        <p className="text-sm text-stone-600 mt-4 text-center">
          No account?{' '}
          <Link to="/signup" className="text-stone-900 underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}