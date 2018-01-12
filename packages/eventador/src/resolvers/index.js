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
          return pubsub.asyncIterator(`${LIKE_COUNT_CHANGED}_${args.designId}`);
        },
        (payload, variables) => {
          console.log(payload, variables);
          return payload.designId === variables.designId;
        },
      ),
    },
  },
};
