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
const beerCounts = {
  Coors: 40,
  BudLight: 30,
  Fosters: 10,
  Corona: 10,
};

const beerMap = {
  Coors: createTypes(beer, beerCounts.Coors, 'Coors'),
  BudLight: createTypes(beer, beerCounts.BudLight, 'BudLight'),
  Fosters: createTypes(beer, 10, beerCounts.Fosters),
  Corona: createTypes(beer, 10, beerCounts.Corona),
};

export default {
  Query: () => ({
    beers: (root, { folderName = 'Coors' }) => {
      return beerMap[folderName];
    },
    beerCounts: () => {
      const counts = Object.keys(beerCounts).map((id) => {
        return {
          folderName: id,
          count: beerCounts[id],
        };
      });

      return counts;
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
