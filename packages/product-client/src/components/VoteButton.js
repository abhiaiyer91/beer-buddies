import styled from 'react-emotion';
import { compose, branch, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { beersQuery } from '../queries';

const upvoteMutation = gql`
  mutation upvoteMutation($beerId: ID!) {
    upvote(beerId: $beerId)
  }
`;

const downvoteMutation = gql`
  mutation downvoteMutation($beerId: ID!) {
    downvote(beerId: $beerId)
  }
`;

const Button = styled('button')`
  border-radius: 2px;
  background-color: ${props => props.color};
  border: 1px solid ${props => props.color};
  color: white;
`;

export default compose(
  branch(({ isUpvote }) => !!isUpvote, graphql(upvoteMutation), graphql(downvoteMutation)),
  withHandlers({
    onClick: ({ mutate, beerId, isUpvote }) => () => {
      mutate({
        variables: {
          beerId: `${beerId}`,
        },
        update: (client) => {
          try {
            const dataObject = client.readQuery({
              query: beersQuery,
            });

            const beers = dataObject && dataObject.beers;
            const voteValue = isUpvote ? 1 : -1;

            const beersMapped = beers.map(({ id, likeCount, ...rest }) => {
              if (id === beerId) {
                likeCount += voteValue;
              }

              return {
                id,
                likeCount,
                ...rest,
              };
            });

            dataObject.beers = beersMapped;

            return client.writeQuery({
              query: beersQuery,
              data: dataObject,
            });
          } catch (e) {
            console.error(e);
          }
        },
      }).catch((e) => {
        alert('YOU DONE FUCKED UP');
      });
    },
  }),
)(Button);
