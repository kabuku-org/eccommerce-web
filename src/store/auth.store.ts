import { create } from 'zustand'
import type { User } from '../types/user.types'

type AuthStore = {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

// helper — safely parse user from localStorage
function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  // hydrate from localStorage on page load
  user: getStoredUser(),
  token: localStorage.getItem('token'),

  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user)) // store user too
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },
}))