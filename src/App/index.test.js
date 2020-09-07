import React from 'react';
import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from '@testing-library/react';

import App from './';

describe('App', () => {
  it('renders snapshot', () => {
    const { container } = render(
      <MockedProvider client={[]}>
        <App />
      </MockedProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
  })
});
