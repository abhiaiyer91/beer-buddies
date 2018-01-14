import React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import Page from './components/Page';

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5000/graphql/subscriptions',
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink();

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  link,
  cache: new InMemoryCache(),
});

function GraphQLRoot({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default function App() {
  return (
    <GraphQLRoot>
      <Page />
    </GraphQLRoot>
  );
}
