import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import React from 'react';

const authServiceLink = createHttpLink({
  uri: "http://localhost:4000/graphql", // Authentication microservice
  credentials: "include",
});

export const authClient = new ApolloClient({
  link: authServiceLink,
  cache: new InMemoryCache(),
});
