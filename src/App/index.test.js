import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './';

describe('App', () => {
  it('renders snapshot', () => {
    const { container } = render(<App />);

    expect(container.firstChild).toMatchSnapshot();
  })
});
