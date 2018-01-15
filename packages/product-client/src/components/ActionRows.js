import React from 'react';
import styled from 'react-emotion';
import withMoveToFolder from '../containers/withMoveToFolder';
import { Row, Col, AutoCol } from './Flex';
import { RowInner, Card } from './CoreComponents';

const Button = styled('button')`
  background-color: pink;
`;

const folders = ['Coors', 'Bud Light', 'Fosters', 'Corona'];

function ActionRow({ move }) {
  return (
    <Row>
      <Col>
        <Card>
          <RowInner>
            <Row>
              {folders.map((id) => {
                return (
                  <AutoCol key={id} basis="auto" alignSelf="center">
                    <Button
                      onClick={function moveTo() {
                        return move(id);
                      }}
                    >
                      Move to ${id}
                    </Button>
                  </AutoCol>
                );
              })}
            </Row>
          </RowInner>
        </Card>
      </Col>
    </Row>
  );
}

export default withMoveToFolder(ActionRow);
