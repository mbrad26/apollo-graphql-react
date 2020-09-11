import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

import './style.css';
import Loading from '../../Loading'; 
import IssueItem from '../IssueItem'; 
import ErrorMessage from '../../Error';
import { ButtonUnobtrusive } from '../../Button';


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

const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const TRANSITION_LABELS = { 
  [ISSUE_STATES.NONE]: 'Show Open Issues', 
  [ISSUE_STATES.OPEN]: 'Show Closed Issues', 
  [ISSUE_STATES.CLOSED]: 'Hide Issues',
};

const TRANSITION_STATE = { 
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN, 
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
}

const isShow = issueState => issueState != ISSUE_STATES.NONE;

const Issues = ({ 
  repositoryName, 
  repositoryOwner 
}) => {
  const [issueState, setIssueState] = useState(ISSUE_STATES.NONE);
  const { loading, error, data } = useQuery(
    GET_ISSUES_OF_REPOSITORY,
    { variables: { repositoryOwner, repositoryName }},
    );
  
  const onChangeIssueState = nextIssueState => {
    setIssueState(nextIssueState);
  }

  if(loading) return <Loading />;
  if(error) return <ErrorMessage error={error} />;
  if(!data.repository.issues.edges.length) {
    return <div className='IssueList'>No issues ...</div>
  };

  const filtereredRepository = {
    issues: {
      edges: data.repository.issues.edges.filter(
        issue => issue.node.state === issueState,
      ),
    },
  };

  if(!filtereredRepository.issues.edges.length) {
    return <div className="IssueList">No issues ...</div>;
  }

  return (
    <div className='Issues'>
      <ButtonUnobtrusive
        onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
      >
        {TRANSITION_LABELS[issueState]}
      </ButtonUnobtrusive>
      {isShow(issueState) && <IssueList issues={filtereredRepository.issues} />}
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
