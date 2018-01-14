import { range, reduce, size } from 'lodash';
import createRedisPublisher from '../../eventador-client/src';

const faker = require('faker');

const pubsub = createRedisPublisher();

function createTypes(factory, number = 10) {
  const rangeItems = range(number);

  return rangeItems.map(item => factory(item));
}

function like() {
  return {
    customerId: faker.random.uuid(),
    vote: faker.random.boolean() ? 1 : -1,
  };
}

function beerCreator(index) {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  return {
    id: `${index}_CREATOR`,
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    avatar: faker.image.avatar(),
  };
}

function beer(index) {
  const likes = createTypes(like);

  const likeCount = reduce(likes, (memo, currentVal) => currentVal.vote + memo, 0);

  return {
    creator: beerCreator(index),
    brand: {
      name: faker.company.companyName(),
    },
    id: `${index}_BEER`,
    url: faker.random.image(),
    createdAt: faker.date.recent(),
    likes,
    likeCount,
    totalLikes: size(likes),
  };
}

const likeCountEvent = beerId => `Likes.${beerId}.LIKE_COUNT_CHANGED`;

export default {
  Query: () => ({
    beers: root => createTypes(beer),
  }),
  Mutation: () => ({
    upvote: (root, { beerId }) => {
      pubsub.publish(likeCountEvent(beerId), {
        id: beerId,
        likeCount: {
          newLikeCount: 2,
        },
      });
      return true;
    },
    downvote: (root, { beerId }) => {
      pubsub.publish(likeCountEvent(beerId), {
        id: beerId,
        likeCount: {
          newLikeCount: faker.random.number(),
        },
      });
      return true;
    },
  }),
};
