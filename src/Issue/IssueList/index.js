import React from 'react';
import { gql, useQuery } from '@apollo/client';

import './style.css';
import Loading from '../../Loading'; 
import IssueItem from '../IssueItem'; 
import ErrorMessage from '../../Error';


const GET_ISSUES_OF_REPOSITORY = gql`
  query($repositoryOwner: String!, $repositoryName: String!) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
      }
    }
  }
`;

const Issues = ({ 
  repositoryName, 
  repositoryOwner 
}) => {
  const { loading, error, data } = useQuery(
    GET_ISSUES_OF_REPOSITORY,
    { variables: { repositoryOwner, repositoryName }},
    );

  if(loading) return <Loading />;
  if(error) return <ErrorMessage error={error} />;
  if(!data.repository.issues.edges.length) {
    return <div className='IssueList'>No issues ...</div>
  };

  return (
    <div className='Issues'>
      <IssueList issues={data.repository.issues} />
    </div>
  );
};

const IssueList = ({ issues }) => (
  <div className='IssueList'>
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} />
    ))}
  </div>
)

export default Issues;
