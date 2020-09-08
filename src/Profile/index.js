import React from 'react';
import { useQuery, gql } from '@apollo/client';

import ErrorMessage from '../Error';
import Loading from '../Loading';
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';

const GET_CURRENT_USER = gql`
{
  viewer {
    repositories(first: 5, orderBy: { direction: DESC, field: STARGAZERS }) {
      edges {
        node {
          ...repository
        }
      }
    }
  }
}
${REPOSITORY_FRAGMENT}
`;

const Profile = () => {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  if(loading) return <Loading />
  if(error) return <ErrorMessage error={error} />

  return (
    <RepositoryList repositories={data.viewer.repositories} />
  );
};

export default Profile;
