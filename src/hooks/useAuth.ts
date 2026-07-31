
import { useMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { REGISTER, LOGIN } from '../apollo/queries/auth.queries'
import { useAuthStore } from '../store/auth.store'
import type { RegisterInput, LoginInput } from '../types/user.types'
import type { RegisterResponse, LoginResponse } from '../apollo/queries/auth.queries'

export function useAuth() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const logout = useAuthStore((state) => state.logout)

  const [LoginMutation, { loading: loginLoading, error: loginError }] =
    useMutation<LoginResponse>(LOGIN)

  const [RegisterMutation, { loading: registerLoading, error: registerError }] =
    useMutation<RegisterResponse>(REGISTER)

  async function login(input: LoginInput) {
    const result = await LoginMutation({ variables: { input } })

    const token = result.data?.login.token
    const user = result.data?.login.user

    if (!token || !user) {
      throw new Error('Login failed: No token or user returned')
    }

    // save to store + localStorage
    setAuth(user, token)

    // redirect based on role
    if (user.role === 'ADMIN' ) {
      navigate('/dashboard')
    } else {
      navigate('/home')
    }
  }

  async function register(input: RegisterInput) {
    const result = await RegisterMutation({ variables: { input } })
    const user = result.data?.register

    if (!user) {
      throw new Error('Registration failed: No user returned')
    }

    // auto login after register
    await login({ email: input.email, password: input.password })
  }

  // ← logout is a function returned for components to call
  //   NOT called here directly — that was the bug
  function handleLogout() {
    logout()
    navigate('/')
  }

  return {
    login,
    register,
    logout: handleLogout,
    loginLoading,
    loginError,
    registerLoading,
    registerError,
  }
}