import React from 'react';
import ReactDOM from 'react-dom';
import {
  HttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';

import './style.css';
import App from './App';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const cache = new InMemoryCache();

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if(graphQLErrors) {
    // do something
  }
  if(networkError) {
    //do something
  }
});

const link = ApolloLink.from([errorLink, httpLink]);

const client = new ApolloClient({
  link,
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
