import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from '../pages/HomePage';

const GuestRoutes = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/user/confirmation/:confToken" component={() => <h1>Conf component</h1>} />
    <Route exact path="/user/forgot_password" component={HomePage} />
    <Route exact path="/user/reset_password/:resetToken" component={() => <h1>Reset passwor component</h1>} />
    <Route path="*" component={() => <Redirect to="/" />} />
  </Switch>
);

export default GuestRoutes;
