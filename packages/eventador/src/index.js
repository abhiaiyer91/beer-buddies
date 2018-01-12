import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import schema from './schema';

const PORT = 4020;

const app = express();

SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server: app,
    path: '/graphql/subscriptions',
  },
);

// // bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: 'ws://localhost:5000/graphql/subscriptions',
  }),
);

app.listen(PORT, () => {
  console.log('SUH SUBS DUDE');
});

const WS_PORT = 5000;

// Create WebSocket listener server
const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

// Bind it to port and start listening
websocketServer.listen(WS_PORT, () =>
  console.log(`Websocket Server is now running on http://localhost:${WS_PORT}`));

SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server: websocketServer,
    path: '/graphql/subscriptions',
  },
);
