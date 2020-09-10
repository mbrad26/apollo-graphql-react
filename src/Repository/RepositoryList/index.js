import React from 'react';

import '../style.css';
import Issues from '../../Issue';
import FetchMore from '../../FetchMore';
import RepositoryItem from '../RepositoryItem';

const getUpdateQuery = entry => (previousResult, { fetchMoreResult }) => {
  if(!fetchMoreResult) return previousResult;

  return {
    ...previousResult,
    [entry]: {
      ...previousResult[entry],
      repositories: {
        ...previousResult[entry].repositories,
        ...fetchMoreResult[entry].repositories,
        edges: [
          ...previousResult[entry].repositories.edges,
          ...fetchMoreResult[entry].repositories.edges,
        ]
      }
    }
  }
};

const RepositoryList = ({ repositories, fetchMore, entry }) =>
  <>
    {repositories.edges.map(({ node }) => (
        <div key={node.id} className='RepositoryItem'>
          <RepositoryItem {...node} />

          <Issues
            repositoryName={node.name}
            repositoryOwner={node.owner.login}
          />
        </div>
      ))
    }

    <FetchMore
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{
        cursor: repositories.pageInfo.endCursor
      }}
      fetchMore={fetchMore}
      updateQuery={getUpdateQuery(entry)}
    >
      Repositories
    </FetchMore>
  </>
export default RepositoryList;
