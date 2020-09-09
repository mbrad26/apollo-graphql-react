import React from 'react';

import '../style.css';
import FetchMore from '../../FetchMore';
import RepositoryItem from '../RepositoryItem';

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if(!fetchMoreResult) return previousResult;

  return {
    ...previousResult,
    viewer: {
      ...previousResult.viewer,
      repositories: {
        ...previousResult.viewer.repositories,
        edges: [
          ...previousResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges,
        ]
      }
    }
  }
};

const RepositoryList = ({ repositories, fetchMore }) =>
  <>
    {repositories.edges.map(({ node }) => (
        <div key={node.id} className='RepositoryItem'>
          <RepositoryItem {...node} />
        </div>
      ))
    }

    <FetchMore
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{
        cursor: repositories.pageInfo.endCursor
      }}
      fetchMore={fetchMore}
      updateQuery={updateQuery}
    >
      Repositories
    </FetchMore>
  </>
export default RepositoryList;
