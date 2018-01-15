import { graphql } from 'react-apollo';
import { compose, withHandlers } from 'recompose';
import { moveMutation } from '../queries';

export default compose(
  graphql(moveMutation),
  withHandlers({
    move: ({ mutate, checkedItems = {} }) => {
      return (folderName) => {
        return mutate({
          variables: {
            folderName,
            beerIds: Object.values(checkedItems),
          },
        });
      };
    },
  }),
);
