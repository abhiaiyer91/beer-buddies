import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import resolvers from '../resolvers';
import mocks from '../mocks';
import typeDefs from './typeDefinitions';

const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

if (process.env.NODE_ENV === 'development' && !!process.env.MOCK) {
  // Add mocks, modifies schema in place
  addMockFunctionsToSchema({ schema: graphqlSchema, mocks });
}

export default graphqlSchema;
