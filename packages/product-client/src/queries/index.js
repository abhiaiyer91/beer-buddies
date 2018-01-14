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

export const beerCountsQuery = gql`
  query beerCounts {
    beerCounts {
      folderName
      count
    }
  }
`;

export const beersQuery = gql`
  ${beerFragment}
  query beers($folderName: String!) {
    beers(folderName: $folderName) {
      ...BeerFragment
    }
  }
`;

export const likeCountSubscription = gql`
  subscription likeCount($beerId: ID!) {
    likeCount(beerId: $beerId) {
      id
      newLikeCount
    }
  }
`;
