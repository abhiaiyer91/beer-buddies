import { range, reduce, size } from 'lodash';
import createRedisPublisher from '../../eventador-client/src';

const faker = require('faker');

const pubsub = createRedisPublisher();

function createTypes(factory, number = 10) {
  const rangeItems = range(number);

  return rangeItems.map(() => factory());
}

function design() {
  const likes = createTypes(like);

  const likeCount = reduce(likes, (memo, currentVal) => currentVal.vote + memo, 0);

  return {
    designer: designer(),
    id: faker.random.uuid(),
    url: faker.image.imageUrl(),
    createdAt: faker.date.recent(),
    likes,
    likeCount,
    totalLikes: size(likes),
  };
}

function designer() {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  return {
    id: faker.random.uuid(),
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    avatar: faker.image.avatar(),
  };
}

function like() {
  return {
    customerId: faker.random.uuid(),
    vote: faker.random.boolean() ? 1 : -1,
  };
}

export default {
  Query: () => ({
    designs: (root, {}, context) => createTypes(design),
  }),
  Mutation: () => ({
    upvote: (root, { designId }) => {
      pubsub.publish(`LIKE_COUNT_CHANGED_${designId}`, {
        designId,
        likeCount: {
          newLikeCount: 2,
        },
      });
      return true;
    },
    downvote: (root, { designId }) => {
      pubsub.publish(`LIKE_COUNT_CHANGED_${designId}`, {
        designId,
        likeCount: {
          newLikeCount: faker.random.number(),
        },
      });
      return true;
    },
  }),
};
