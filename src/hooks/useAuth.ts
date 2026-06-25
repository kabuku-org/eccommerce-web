import { useMutation, useLazyQuery } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { REGISTER, LOGIN, ME } from '../apollo/queries/auth.queries'
import { useAuthStore } from '../store/auth.store'
import type { RegisterInput, LoginInput } from '../types/user.types'
import type { RegisterResponse, LoginResponse, MeResponse } from '../apollo/queries/auth.queries'

export function useAuth() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const logout = useAuthStore((state) => state.logout)

const [LoginMutation, { loading: loginLoading, error: loginError }] = useMutation<LoginResponse>(LOGIN)
const [RegisterMutation, { loading: registerLoading, error: registerError }] = useMutation<RegisterResponse>(REGISTER)

    async function login (input: LoginInput) {
      const result  = await LoginMutation({ variables: { input } });

      const token = result.data?.login.token;
      const user = result.data?.login.user;

      if (!token || !user) {
        throw new Error('Login failed: No token or user returned');
      }

      useAuthStore
      .getState()
      .setAuth(user, token); // Store the user and token in the auth store

      // we have an auth store
    

      navigate('/dashboard'); // Redirect to dashboard or any other page after login
    }

    async function register (input: RegisterInput) {
      const result  = await RegisterMutation({ variables: { input } });

      const user = result.data?.register;

      if (!user) {
        throw new Error('Registration failed: No user returned');
      }

      // Store the user in local storage or state management
      useAuthStore.getState().setAuth(user, '');

       //  after registration let the user login automatically
      await login({ email: input.email, password: input.password });
    }

      
    logout(); // Call logout to clear any existing auth state
    
     
return {
  
  login,
  register,

  loginLoading,
  loginError,
  registerLoading,
  registerError,  

}
}
