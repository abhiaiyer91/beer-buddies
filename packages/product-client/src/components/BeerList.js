import React from 'react';
import gql from 'graphql-tag';
import { compose, mapProps, lifecycle, withHandlers } from 'recompose';
import styled from 'react-emotion';
import { graphql, withApollo } from 'react-apollo';
import { beersQuery, likeCountSubscription, beerFragment } from '../queries';
import { Row, Col, ColItem } from './Flex';
import VoteButton from './VoteButton';

const Card = styled('div')`
  border-radius: 0px;
  border: 1px solid rgba(0, 0, 0, 0.12);
`;

const ImgContainer = styled('div')`
  max-width: 100%;
  text-align: right;
`;

const Img = styled('img')`
  height: auto;
  max-width: 100px;
`;

function withSubscribe(subscriptionDocument, optionsObject) {
  return compose(
    withApollo,
    withHandlers({
      subscribe: ({ client, onResult, ...rest }) => {
        const optionsFn = optionsObject && optionsObject.options;
        return () => {
          client.subscribe({ query: subscriptionDocument, ...optionsFn(rest) }).subscribe({
            next: onResult,
          });
        };
      },
    }),
  );
}

const SubscriptionContainer = compose(
  withApollo,
  withHandlers({
    onResult: ({ id, client }) => {
      return (result) => {
        try {
          const beerData = client.readFragment({
            id: `Beer:${id}`,
            fragment: gql(beerFragment),
          });

          const newLikeCount =
            result && result.data && result.data.likeCount && result.data.likeCount.newLikeCount;

          beerData.likeCount = newLikeCount;

          client.writeFragment({
            id: `Beer:${id}`,
            fragment: gql(beerFragment),
            data: beerData,
          });
        } catch (e) {
          console.error(e);
        }
      };
    },
  }),
  withSubscribe(likeCountSubscription, {
    options: ({ id }) => {
      return {
        variables: {
          beerId: id,
        },
      };
    },
  }),
  lifecycle({
    componentDidMount() {
      return this.props.subscribe();
    },
  }),
)(({ children }) => {
  return children;
});

function BeersList({ loading, beers = [], subscribeToMore }) {
  if (loading) {
    return <p> Loading!!</p>;
  }

  return (
    <Row>
      {beers.map(({
 url, brand, id, likeCount = 0,
}) => (
  <SubscriptionContainer id={id}>
    <Col key={`${id}+BEER`}>
      <Card>
        <Row>
          <ColItem>{brand && brand.name}</ColItem>
          <ColItem>
            <p>Like Count: {likeCount}</p>
            <VoteButton isUpvote beerId={id} color="blue">
                    Upvote
            </VoteButton>
            <VoteButton beerId={id} color="red">
                    Downvote
            </VoteButton>
          </ColItem>

          <ColItem>
            <ImgContainer>
              <Img src={url} />
            </ImgContainer>
          </ColItem>
        </Row>
      </Card>
    </Col>
  </SubscriptionContainer>
      ))}
    </Row>
  );
}

export default compose(
  graphql(beersQuery, {
    name: 'beersList',
  }),
  mapProps(({ beersList, ...rest }) => ({
    beers: (beersList && beersList.beers) || [],
    loading: beersList && beersList.loading,
    subscribeToMore: beersList.subscribeToMore,
    ...rest,
  })),
)(BeersList);
