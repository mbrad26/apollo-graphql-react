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
          <Button
            className={'RepositoryItem-title-action'}
            onClick={() => addStar({ variables: { id }})}
          >
            {stargazers.totalCount} Star
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
