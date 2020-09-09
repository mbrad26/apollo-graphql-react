import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './style.css';
import Profile from '../Profile';
import Navigation from './Navigation';
import Organization from '../Organization';
import * as routes from '../constants/routes';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Navigation />
        <div className='App-main'>
          <Route
            exact
            path={routes.ORGANIZATION}
            component={() =>
              <div className='App-content_large-header'>
                <Organization />
              </div>
            }
          />
          <Route
            path={routes.PROFILE}
            component={() =>
              <div className='App-content_small-header'>
                <Profile />
              </div>
            }
          />
        </div>
      </div>
      <Profile />
    </Router>
  );
};

export default App;
