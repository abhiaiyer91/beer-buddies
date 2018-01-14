import React from 'react';
import styled from 'react-emotion';
import { compose, withHandlers, withState } from 'recompose';
import BeersList from './BeerList';
import { Row, AutoCol, ColItem } from './Flex';
import Folders from './Folders';

const Container = styled('main')`
  max-width: 1280px;
  margin: 0 auto;
`;

function Page({ folderName, setFolderName }) {
  return (
    <Container>
      <Row>
        <AutoCol>
          <Folders setFolderName={setFolderName} currentFolderName={folderName} />
        </AutoCol>
        <ColItem>
          <BeersList folderName={folderName} />
        </ColItem>
      </Row>
    </Container>
  );
}

export default compose(
  withState('folderName', 'setFolder', 'Coors'),
  withHandlers({
    setFolderName: ({ setFolder }) => {
      return (folderName) => {
        return setFolder(folderName);
      };
    },
  }),
)(Page);
