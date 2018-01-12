import gql from 'graphql-tag';

export const designQuery = gql`
  query designs {
    designs {
      id
      designer {
        name
      }
      url
      likeCount
    }
  }
`;
