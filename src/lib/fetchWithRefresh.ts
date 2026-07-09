let accessToken: string | null = null

export function setAccessToken(token: string) {
    accessToken = token
}

export function getAccessToken(): string | null {
    return accessToken
}

export async function fetchWithRefresh(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const headers = new Headers(init && init.headers ? init.headers : undefined)
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

    const options: RequestInit = { ...(init || {}), headers, credentials: 'include' }
    let res = await fetch(input, options)

    if (res.status !== 401) return res

    // try refreshing the access token using httpOnly refresh cookie
    const refreshResp = await fetch('/auth/refresh', { method: 'POST', credentials: 'include' })
    if (!refreshResp.ok) {
        // refresh failed — caller should handle (e.g., redirect to login)
        throw new Error('refresh_failed')
    }

    const data = await refreshResp.json()
    if (!data.access_token) throw new Error('no_access_token_from_refresh')

    // update in-memory access token and retry original request
    setAccessToken(data.access_token)
    headers.set('Authorization', `Bearer ${data.access_token}`)
    const retryOptions: RequestInit = { ...(init || {}), headers, credentials: 'include' }
    return fetch(input, retryOptions)
}

export default fetchWithRefresh
