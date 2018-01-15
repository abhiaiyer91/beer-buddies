import { compose, mapProps } from 'recompose';
import { graphql } from 'react-apollo';
import { beersQuery } from '../queries';

export default compose(
  graphql(beersQuery, {
    name: 'beersList',
    options: ({ folderName = 'Coors' }) => {
      return {
        variables: {
          folderName,
        },
      };
    },
  }),
  mapProps(({ beersList, ...rest }) => ({
    beers: (beersList && beersList.beers) || [],
    loading: beersList && beersList.loading,
    ...rest,
  })),
);
