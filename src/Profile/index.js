import React from 'react';
import { useQuery, gql } from '@apollo/client';

import ErrorMessage from '../Error';
import Loading from '../Loading';
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';

const GET_CURRENT_USER = gql`
query($cursor: String) {
  viewer {
    repositories(
      first: 5,
      orderBy: { direction: DESC, field: STARGAZERS },
      after: $cursor
    ) {
      edges {
        node {
          ...repository
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
${REPOSITORY_FRAGMENT}
`;

const Profile = () => {
  const { loading, error, data, fetchMore } = useQuery(GET_CURRENT_USER);

  if(loading) return <Loading />
  if(error) return <ErrorMessage error={error} />

  console.log('DATA: ', data.viewer);

  return (
    <RepositoryList
      repositories={data.viewer.repositories}
      fetchMore={fetchMore}
    />
  );
};

export default Profile;
