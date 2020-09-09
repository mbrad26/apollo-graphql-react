import React from 'react';
import { useMutation, gql } from '@apollo/client';

import '../style.css';
import Link from '../../Link';
import Button from '../../Button';
import { REPOSITORY_FRAGMENT } from '../';

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id}) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const REMOVE_STAR = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const UPDATE_SUBSCRIPTION = gql`
  mutation($id: ID!, $state: String) {
    updateSubscription(input: { subscribableId: $id, state: $state}) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const updateSubscriptionStatus = (client, { data: { updateSubscription: { subscribable: { id }}}}) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const viewerSubscription = repository.viewerSubscription === 'SUBSCRIBED'
    ? 'UNSUBSCRIBED'
    : 'SUBSCRIBED';

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      viewerSubscription: {
        ...repository.viewerSubscription,
        viewerSubscription,
      }
    }
  });
};

const updateAddStar = (client, { data: { addStar: { starrable: { id }}}}) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.stargazers.totalCount + 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount,
      },
    },
  });
};

const updateRemoveStar = (client, { data: { removeStar: { starrable: { id }}}}) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.stargazers.totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount,
      },
    },
  });
};

const RepositoryItem = ({
  id,
  url,
  name,
  owner,
  watchers,
  stargazers,
  descriptionHTML,
  primaryLanguage,
  viewerHasStarred,
  viewerSubscription,
}) => {
  const [addStar, { data }] = useMutation(STAR_REPOSITORY, { update: updateAddStar });
  const [removeStar, {}] = useMutation(REMOVE_STAR, { update: updateRemoveStar });
  const [updateSubscription] = useMutation(UPDATE_SUBSCRIPTION, { update: updateSubscriptionStatus });

  return (
    <div>
      <div className="RepositoryItem-title">
        <h2>
          <Link href={url}>{name}</Link>
        </h2>

        <div className="RepositoryItem-title-action">
          {stargazers.totalCount} Stars
        </div>

        <div>
          {!viewerHasStarred
            ? <Button
                className={'RepositoryItem-title-action'}
                onClick={() => addStar({ variables: { id }})}
              >
                {stargazers.totalCount} Star
              </Button>
            : <Button
                className={'RepositoryItem-title-action'}
                onClick={() => removeStar({ variables: { id }})}
              >
                {stargazers.totalCount} Star
              </Button>
          }
          {viewerSubscription === 'UNSUBSCRIBED'
            ? <Button
                className={'RepositoryItem-title-action'}
                onClick={() => updateSubscription({ variables: { id, state: 'SUBSCRIBED' }})}
              >
                Watch
              </Button>
            : <Button
                className={'RepositoryItem-title-action'}
                onClick={() => updateSubscription({ variables: { id, state: 'UNSUBSCRIBED' }})}
              >
                Unwatch
              </Button>

          }
        </div>
      </div>

      <div className="RepositoryItem-description">
        <div
          className="RepositoryItem-description-info"
          dangerouslySetInnerHTML={{ __html: descriptionHTML }}
        />
        <div className="RepositoryItem-description-details">
          <div>
            {primaryLanguage && (
              <span>Language: {primaryLanguage.name}</span>
            )}
          </div>
          <div>
            {owner && (
              <span>
                Owner: <a href={owner.url}>{owner.login}</a>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryItem;
