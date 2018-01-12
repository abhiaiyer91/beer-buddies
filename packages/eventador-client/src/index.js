import { RedisPubSub } from 'graphql-redis-subscriptions';

export default function createRedisPublisher(config = {}) {
  return new RedisPubSub(config);
}
