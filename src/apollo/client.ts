import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql",
});

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});