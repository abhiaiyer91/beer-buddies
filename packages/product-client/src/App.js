import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import DesignList from './components/DesignList';

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  link: new HttpLink(),
  cache: new InMemoryCache(),
});

function GraphQLRoot({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

class App extends Component {
  render() {
    return (
      <GraphQLRoot>
        <DesignList />
      </GraphQLRoot>
    );
  }
}

export default App;
