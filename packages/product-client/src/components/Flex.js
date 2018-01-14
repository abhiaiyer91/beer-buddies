import styled from 'react-emotion';

export const Row = styled('section')`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const Col = styled('div')`
  flex: 0 0 100%;
  align-self: center;
`;

export const ColItem = styled('div')`
  flex: 1 0 0px;
  align-self: center;
`;

export const AutoCol = styled('div')`
  flex: 0 0 auto;
`;
