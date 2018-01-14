import { withFilter } from 'graphql-subscriptions';
import createRedisPublisher from '../../../eventador-client/src';

const pubsub = createRedisPublisher();

const LIKE_COUNT_CHANGED = 'LIKE_COUNT_CHANGED';

export default {
  Subscription: {
    likeCount: {
      subscribe: withFilter(
        (_, args) => {
          console.log(args);
          return pubsub.asyncIterator(`Likes.${args.beerId}.${LIKE_COUNT_CHANGED}`);
        },
        (payload, variables) => {
          console.log(payload, variables);
          return payload.id === variables.beerId;
        },
      ),
    },
  },
};
