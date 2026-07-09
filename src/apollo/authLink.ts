import { ApolloLink, Observable } from '@apollo/client'
import { setAccessToken, getAccessToken } from '../lib/fetchWithRefresh'

// Simple Apollo link that adds Authorization header and refreshes on 401-like errors
export const authLink = new ApolloLink((operation, forward) => {
    const token = getAccessToken()
    if (token) {
        operation.setContext(({ headers = {} }) => ({
            headers: { ...headers, Authorization: `Bearer ${token}` },
        }))
    }

    return new Observable(observer => {
        let sub: any
        const handle = async () => {
            try {
                sub = forward(operation).subscribe({
                    next: (result) => observer.next(result),
                    error: async (err) => {
                        // if unauthenticated, try refresh endpoint
                        const status = err?.statusCode || (err?.networkError && err.networkError.statusCode) || null
                        if (status === 401) {
                            try {
                                const r = await fetch('/auth/refresh', { method: 'POST', credentials: 'include' })
                                if (!r.ok) throw new Error('refresh_failed')
                                const data = await r.json()
                                if (!data.access_token) throw new Error('no_access_token')
                                setAccessToken(data.access_token)
                                // retry operation with new token
                                operation.setContext(({ headers = {} }) => ({
                                    headers: { ...headers, Authorization: `Bearer ${data.access_token}` },
                                }))
                                // forward again
                                forward(operation).subscribe({
                                    next: (res) => observer.next(res),
                                    error: (e) => observer.error(e),
                                    complete: () => observer.complete(),
                                })
                            } catch (refreshErr) {
                                observer.error(refreshErr)
                            }
                        } else {
                            observer.error(err)
                        }
                    },
                    complete: () => observer.complete(),
                })
            } catch (e) {
                observer.error(e)
            }
        }
        handle()

        return () => {
            if (sub) sub.unsubscribe()
        }
    })
})

export default authLink
