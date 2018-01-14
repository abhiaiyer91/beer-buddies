import React from 'react';
import styled from 'react-emotion';
import { compose, mapProps } from 'recompose';
import { graphql } from 'react-apollo';

import { beerCountsQuery } from '../queries';

const FolderCard = styled('div')`
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  margin-right: 10px;
`;

const MenuList = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled('li')`
  text-align: left;
  padding: 8px 0;
`;

const ListButton = styled('button')`
  text-align: left;
  background-color: transparent;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  color: ${(props) => {
    return props.isActive ? 'pink' : 'black';
  }};
  &:hover {
    color: pink;
  }
`;

const beers = [
  {
    name: 'Coors',
  },
  {
    name: 'BudLight',
  },
  {
    name: 'Corona',
  },
  {
    name: 'Fosters',
  },
];

function Folders({
  currentFolderName, folders = [], setFolderName, loading,
}) {
  return (
    <FolderCard>
      <MenuList>
        {loading ? (
          <p>loading</p>
        ) : (
          folders.map(({ folderName, count }) => {
            return (
              <ListItem key={folderName}>
                <ListButton
                  onClick={function set() {
                    return setFolderName(folderName);
                  }}
                  isActive={currentFolderName === folderName}
                >
                  {folderName}{' '}
                  {count}
                </ListButton>
              </ListItem>
            );
          })
        )}
      </MenuList>
    </FolderCard>
  );
}

export default compose(
  graphql(beerCountsQuery),
  mapProps(({ data, ...rest }) => {
    return {
      folders: data && data.beerCounts,
      loading: data && data.loading,
      ...rest,
    };
  }),
)(Folders);
