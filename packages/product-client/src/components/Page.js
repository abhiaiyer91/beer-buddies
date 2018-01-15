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

const LeftAside = styled('div')`
  max-width: 300px;
`;

function Page({ folderName, setFolderName }) {
  return (
    <Container>
      <Row>
        <AutoCol basis="300px">
          <LeftAside>
            <Folders setFolderName={setFolderName} currentFolderName={folderName} />
          </LeftAside>
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
