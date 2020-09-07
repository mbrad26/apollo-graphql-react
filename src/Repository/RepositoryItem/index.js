import React from 'react';
import { useMutation, gql } from '@apollo/client';

import '../style.css';
import Link from '../../Link';
import Button from '../../Button';

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
  const [addStar, { data }] = useMutation(STAR_REPOSITORY);
  const [removeStar, {}] = useMutation(REMOVE_STAR);
  console.log('MUTATION: ', data);

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

          {/* Here comes your updateSubscription mutation */}
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
