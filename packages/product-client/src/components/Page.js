import React from 'react';
import styled from 'react-emotion';
import BeersList from './BeerList';
import { Row, AutoCol, ColItem } from './Flex';
import Folders from './Folders';

const Container = styled('main')`
  max-width: 1280px;
  margin: 0 auto;
`;

export default function Page() {
  return (
    <Container>
      <Row>
        <AutoCol>
          <Folders />
        </AutoCol>
        <ColItem>
          <BeersList />
        </ColItem>
      </Row>
    </Container>
  );
}
