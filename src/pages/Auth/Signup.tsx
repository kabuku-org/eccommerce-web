import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
export function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register, registerLoading, registerError } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await register({ name, email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm border border-stone-200"
      >
        <h1 className="text-2xl font-semibold text-stone-900 mb-6">
          Create account
        </h1>

        <div className="mb-4">
          <label className="block text-sm text-stone-600 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

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
            minLength={8}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        {registerError && (
          <p className="text-red-600 text-sm mb-4">
            {registerError.message.includes('already')
              ? 'That email is already registered.'
              : 'Something went wrong. Try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={registerLoading}
          className="w-full bg-stone-900 text-white py-2 rounded-md hover:bg-stone-800 disabled:opacity-50"
        >
          {registerLoading ? 'Creating account...' : 'Sign up'}
        </button>

        <p className="text-sm text-stone-600 mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-stone-900 underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}