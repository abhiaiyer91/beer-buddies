import React from 'react';
import styled from 'react-emotion';
import { compose, branch, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { designQuery } from '../queries';

const upvoteMutation = gql`
  mutation upvoteMutation($designId: ID!) {
    upvote(designId: $designId)
  }
`;

const downvoteMutation = gql`
  mutation downvoteMutation($designId: ID!) {
    downvote(designId: $designId)
  }
`;

const Button = styled('button')`
  border-radius: 2px;
  background-color: ${props => props.color};
  border: 1px solid ${props => props.color};
  color: white
`;

export default compose(
  branch(({ isUpvote }) => !!isUpvote, graphql(upvoteMutation), graphql(downvoteMutation)),
  withHandlers({
    onClick: ({ mutate, designId, isUpvote }) => () =>
      mutate({
        variables: {
          designId,
        },
        update: (client) => {
          try {
            const dataObject = client.readQuery({
              query: designQuery,
            });

            const designs = dataObject && dataObject.designs;
            const voteValue = isUpvote ? 1 : -1;

            const designsMapped = designs.map(({ id, likeCount, ...rest }) => {
              if (id === designId) {
                likeCount += voteValue;
              }

              return {
                id,
                likeCount,
                ...rest,
              };
            });

            dataObject.designs = designsMapped;

            return client.writeQuery({
              query: designQuery,
              data: dataObject,
            });
          } catch (e) {
            console.error(e);
          }
        },
      }).catch((e) => {
        alert('YOU DONE FUCKED UP');
      }),
  }),
)(Button);
