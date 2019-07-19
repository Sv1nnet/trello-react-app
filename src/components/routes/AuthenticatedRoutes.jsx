import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

const AuthenticatedRoutes = () => (
  <Switch>
    <Route exact path="/board/all" component={() => <h1>All boards</h1>} />
    <Route exact path="/board/:id" component={() => <h1>Specific board</h1>} />
    <Route exact path="/user" component={() => <h1>User page</h1>} />
    <Route path="*" component={() => <Redirect to="/board/all" />} />
  </Switch>
);

export default AuthenticatedRoutes;
