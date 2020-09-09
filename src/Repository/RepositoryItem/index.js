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
  mutation($id: ID!, $state: String!) {
    updateSubscription(input: { subscribableId: $id, state: $state}) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

const isWatch = viewerSubscription =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateSubscriptionStatus = (client, { data: { updateSubscription: { subscribable: { id, viewerSubscription }}}}) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  let { totalCount } = repository.watchers;
  totalCount = viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
    ? totalCount + 1
    : totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount,
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
            <Button
              className={'RepositoryItem-title-action'}
              onClick={() => updateSubscription(
                { variables: {
                  id,
                  state: isWatch(viewerSubscription)
                          ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                          : VIEWER_SUBSCRIPTIONS.SUBSCRIBED
                }}
              )}
            >
              {watchers.totalCount}{' '}
              {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
            </Button>
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
