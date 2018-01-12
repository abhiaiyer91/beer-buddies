import React from "react";
import { compose, mapProps } from "recompose";
import styled, { css } from "react-emotion";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { designQuery } from "../queries";
import VoteButton from "./VoteButton";

const Container = styled("main")`
  max-width: 1280px;
  margin: 0 auto;
`;

const Row = styled("section")`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Col = styled("div")`
  flex: 0 0 auto;
`;

const Card = styled("div")`
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  max-width: 300px;
`;

const ImgContainer = styled("div")`
  width: 100%;
`;

const Img = styled("img")`
  height: auto;
  max-width: 100%;
`;

function DesignList({ loading, designs = [] }) {
  if (loading) {
    return <p> Loading!!</p>;
  }

  return (
    <Container>
      <Row>
        {designs.map(({ url, designer, id, likeCount = 0 }) => (
          <Col>
            <Card>
              {designer && designer.name}
              <ImgContainer>
                <Img src={url} />
              </ImgContainer>
              Like Count: {likeCount}
              <Row>
                <Col>
                  <VoteButton isUpvote designId={id} color="blue">
                    Upvote
                  </VoteButton>
                </Col>
                <Col>
                  <VoteButton designId={id} color="red">
                    Downvote
                  </VoteButton>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default compose(
  graphql(designQuery),
  mapProps(({ data, ...rest }) => ({
    designs: data && data.designs,
    loading: data && data.loading,
    ...rest
  }))
)(DesignList);
