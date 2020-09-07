import React from 'react';
import { useQuery, gql } from '@apollo/client';

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

  if(loading) {
    return <div>Loading ...</div>
  };

  if(error) {
      console.log(error);
      return <div>Error!</div>
  };

  return (
    <div>{data.viewer.name}</div>
  );
};

export default Profile;
