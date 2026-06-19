import { create } from 'zustand'
import type { User } from '../types/user.types'

type AuthStore = {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem('token') ? null : null, // hydrated by useAuth on load
  token: localStorage.getItem('token'),

  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
}))