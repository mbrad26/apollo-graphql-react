import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import './style.css';
import Input from '../../Input';
import Button from '../../Button';
import * as routes from '../../constants/routes';

const OrganizationSearch = ({ organizationName, onOrganizationSearch }) => {
  const [organization, setOrganization] = useState(organizationName);

  const onChange = event => setOrganization(event.target.value);

  const onSubmit = event => {
    event.preventDefault();
    onOrganizationSearch(organization);
  };

  return (
    <div className="Navigation-search">
      <form onSubmit={onSubmit}>
        <Input
          color={'white'}
          type='text'
          value={organizationName}
          onChange={onChange}
        />{' '}
        <Button color={'white'} type='submit'>
          Search
        </Button>
      </form>
    </div>
  );
};

const Navigation = (
  { location: { pathname },
  organizationName,
  onOrganizationSearch,
}) => (
  <header className='Navigation'>
    <div className='Navigation-link'>
      <Link to={routes.PROFILE}>Profile</Link>
    </div>
    <div className='Navigation-link'>
      <Link to={routes.ORGANIZATION}>Organization</Link>
    </div>

    {pathname === routes.ORGANIZATION && (
      <OrganizationSearch
        organizationName={organizationName}
        onOrganizationSearch={onOrganizationSearch}
      />
    )}
  </header>
);

export default withRouter(Navigation);
