import gql from 'graphql-tag';

export const beerFragment = `
fragment BeerFragment on Beer {
  id
  brand {
    name
  }
  creator {
    id
    name
  }
  url
  likeCount
}
`;

export const beersQuery = gql`
  ${beerFragment}
  query beers {
    beers {
      ...BeerFragment
    }
  }
`;

export const likeCountSubscription = gql`
    subscription likeCount($beerId: ID!){
      likeCount(beerId: $beerId){
        id
        newLikeCount
      }
    }
`;
