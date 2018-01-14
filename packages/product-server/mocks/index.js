import { range, reduce, size } from 'lodash';
import createRedisPublisher from '../../eventador-client/src';

const faker = require('faker');

const pubsub = createRedisPublisher();

function createTypes(factory, number = 10, folderName) {
  const rangeItems = range(number);

  return rangeItems.map(item => factory(item, number, folderName));
}

function like() {
  return {
    customerId: faker.random.uuid(),
    vote: faker.random.boolean() ? 1 : -1,
  };
}

function beerCreator(index, number, folderName) {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  return {
    id: `${index}_CREATOR_${folderName}`,
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    avatar: faker.image.avatar(),
  };
}

function beer(index, number, folderName) {
  const likes = createTypes(like, undefined, folderName);

  const likeCount = reduce(likes, (memo, currentVal) => currentVal.vote + memo, 0);

  return {
    creator: beerCreator(index, number, folderName),
    brand: {
      name: faker.company.companyName(),
    },
    id: `${index}_BEER_${folderName}`,
    url: faker.random.image(),
    createdAt: faker.date.recent(),
    likes,
    likeCount,
    totalLikes: size(likes),
  };
}

const likeCountEvent = beerId => `Likes.${beerId}.LIKE_COUNT_CHANGED`;

const beerMap = {
  Coors: createTypes(beer, 40, 'Coors'),
  BudLight: createTypes(beer, 30, 'BudLight Lime'),
  Fosters: createTypes(beer, 10, 'Fosters'),
  Corona: createTypes(beer, 10, 'Corona'),
};

export default {
  Query: () => ({
    beers: (root, { folderName = 'Coors' }) => {
      return beerMap[folderName];
    },
  }),
  Mutation: () => ({
    upvote: (root, { beerId }) => {
      pubsub.publish(likeCountEvent(beerId), {
        id: beerId,
        likeCount: {
          newLikeCount: faker.random.number(),
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
