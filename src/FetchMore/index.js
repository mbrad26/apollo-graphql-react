import React from 'react';

import './style.css';
import { ButtonUnobtrusive } from '../Button';

const FetchMore = ({
  hasNextPage,
  fetchMore,
  variables,
  updateQuery,
  children
}) => (
  <div className='FetchMore'>
    {hasNextPage &&
      <ButtonUnobtrusive
        type='button'
        className='FetchMore-button'
        onClick={() => fetchMore({ variables, updateQuery })}
      >
        More {children}
      </ButtonUnobtrusive>
    }
  </div>
);

export default FetchMore;
