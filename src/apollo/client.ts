import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { Observable } from "@apollo/client";
import { useAuthStore } from "../store/auth.store";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL || "http://localhost:8000/graphql",
  credentials: "include",
});

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().token  // ← read from store not localStorage
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// catches 401 → refreshes → retries original request
const errorLink = new ErrorLink(({  operation, forward }) => {
  if (operation.getContext().response?.status === 401) {
    return new Observable((observer) => {
      fetch(`${import.meta.env.VITE_API_BASE || "http://localhost:8000"}/auth/refresh`, {
        method: "POST",
        credentials: "include",  // sends httpOnly cookie automatically
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            // save new token to store
            useAuthStore.getState().setAccessToken(data.access_token)
            // retry the original failed request
            forward(operation).subscribe(observer)
          } else {
            // refresh failed — session truly expired — force logout
            useAuthStore.getState().logout()
            window.location.href = "/"
          }
        })
        .catch(() => {
          useAuthStore.getState().logout()
          window.location.href = "/"
        })
    })
  }
})

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),  // errorLink must be FIRST
  cache: new InMemoryCache(),
});