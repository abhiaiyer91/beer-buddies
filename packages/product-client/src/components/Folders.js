import React from 'react';
import styled from 'react-emotion';

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

export default function Folders({ folderName, setFolderName }) {
  return (
    <FolderCard>
      <MenuList>
        {beers.map(({ name }) => {
          return (
            <ListItem key={name}>
              <ListButton
                onClick={function () {
                  return setFolderName(name);
                }}
                isActive={folderName === name}
              >
                {name}
              </ListButton>
            </ListItem>
          );
        })}
      </MenuList>
    </FolderCard>
  );
}
