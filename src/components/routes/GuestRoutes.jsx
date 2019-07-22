import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ConfirmationPage from '../pages/ConfirmationPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

const GuestRoutes = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/user/confirmation/:confToken" component={ConfirmationPage} />
    <Route exact path="/user/forgot_password" component={HomePage} />
    <Route exact path="/user/reset_password/:resetToken" component={ResetPasswordPage} />
    <Route path="*" component={() => <Redirect to="/" />} />
  </Switch>
);

export default GuestRoutes;
