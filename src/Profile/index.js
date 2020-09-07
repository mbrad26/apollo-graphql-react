import React from 'react';
import { useQuery, gql } from '@apollo/client';

import Error from '../Error';
import Loading from '../Loading';
import RepositoryList from '../Repository';

const GET_CURRENT_USER = gql`
{
  viewer {
    repositories(first: 5, orderBy: { direction: DESC, field: STARGAZERS }) {
      edges {
        node {
          id
          name
          url
          descriptionHTML
          primaryLanguage {
            name
          }
          owner {
            login
            url
          }
          stargazers {
            totalCount
          }
          viewerHasStarred
          watchers {
            totalCount
          }
          viewerSubscription
        }
      }
    }
  }
}
`;

const Profile = () => {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  if(loading) return <Loading />
  if(error) return <Error error={error} />

  return (
    <RepositoryList repositories={data.viewer.repositories} />
  );
};

export default Profile;
