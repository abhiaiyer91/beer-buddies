import React from 'react';
import gql from 'graphql-tag';
import { withSubscribe } from 'recompose-apollo';
import { compose, withHandlers, withState } from 'recompose';
import { withApollo } from 'react-apollo';
import { likeCountSubscription, beerFragment } from '../queries';
import withBeerList from '../containers/withBeerList';
import { Row, Col, ColItem, AutoCol } from './Flex';
import { RowInner, ImgContainer, Card, Checkbox, Img } from './CoreComponents';
import VoteButton from './VoteButton';
import ActionRows from './ActionRows';

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
)(({ children, onResult }) => {
  return children({ onResult });
});

function BeersList({
  loading, beers = [], setCheckedItem, checkedItems, selectAll,
}) {
  if (loading) {
    return <p> Loading!!</p>;
  }
  return (
    <section>
      {Object.values(checkedItems).filter(Boolean).length > 0 && <ActionRows />}
      <Row>
        {beers.map(({
 url, brand, id, likeCount = 0,
}) => (
  <SubscriptionContainer id={id}>
    {({ onResult }) => {
              return (
                <Col key={`${id}+BEER`}>
                  <Card>
                    <RowInner>
                      <Row>
                        <AutoCol basis="auto" alignSelf="center">
                          <Checkbox
                            onChange={setCheckedItem}
                            value={id}
                            checked={checkedItems[id]}
                            type="checkbox"
                          />
                        </AutoCol>
                        <ColItem>{brand && brand.name}</ColItem>
                        <ColItem>
                          <p>Like Count: {likeCount}</p>
                          <VoteButton onResult={onResult} isUpvote beerId={id} color="blue">
                            Upvote
                          </VoteButton>
                          <VoteButton onResult={onResult} beerId={id} color="red">
                            Downvote
                          </VoteButton>
                        </ColItem>

                        <ColItem>
                          <ImgContainer>
                            <Img src={url} />
                          </ImgContainer>
                        </ColItem>
                      </Row>
                    </RowInner>
                  </Card>
                </Col>
              );
            }}
  </SubscriptionContainer>
        ))}
      </Row>
    </section>
  );
}

export default compose(
  withBeerList,
  withState('checkedItems', 'setItems', {}),
  withHandlers({
    setCheckedItem: ({ setItems, checkedItems }) => {
      return (e) => {
        if (checkedItems && checkedItems[e.target.value]) {
          checkedItems[e.target.value] = false;
        } else {
          checkedItems[e.target.value] = true;
        }

        setItems(checkedItems);
      };
    },
  }),
)(BeersList);
