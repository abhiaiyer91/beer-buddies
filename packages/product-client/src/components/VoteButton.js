import styled from 'react-emotion';
import { compose, branch, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { beerFragment } from '../queries';

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
    onClick: ({
      mutate, onResult, beerId, isUpvote,
    }) => () => {
      mutate({
        variables: {
          beerId: `${beerId}`,
        },
        update: (client) => {
          try {
            const dataObject = client.readFragment({
              id: `Beer:${beerId}`,
              fragment: gql(beerFragment),
            });

            const likeCount = dataObject && dataObject.likeCount;
            const voteValue = isUpvote ? 1 : -1;
            const newLikeCount = likeCount + voteValue;

            onResult({
              data: {
                likeCount: {
                  newLikeCount,
                },
              },
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
