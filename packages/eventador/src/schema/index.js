import { makeExecutableSchema } from 'graphql-tools';
import resolvers from '../resolvers';
import typeDefs from './typeDefinitions';

const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default graphqlSchema;
