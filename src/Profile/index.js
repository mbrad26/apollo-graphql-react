import React from 'react';
import { useQuery, gql } from '@apollo/client';

import Error from '../Error';
import Loading from '../Loading';

const GET_CURRENT_USER = gql`
{
  viewer {
    login
    name
  }
}
`;

const Profile = () => {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  if(loading) return <Loading />
  if(error) return <Error error={error} />

  const { name, login } = data.viewer;

  return (
    <div>{name} {login}</div>
  );
};

export default Profile;
