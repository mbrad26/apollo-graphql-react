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
  const { data } = useQuery(GET_CURRENT_USER);

  return (
    <div>My Profile</div>
  );
};

export default Profile;
