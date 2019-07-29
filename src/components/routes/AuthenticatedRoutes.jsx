import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import UserNavbar from '../navigation/UserNavbar';
import UserBoardsPage from '../pages/UserBoardsPage';

const AuthenticatedRoutes = () => (
  <>
    <UserNavbar />
    <div className="container-fluid">
      <Switch>
        <Route exact path="/board/all" component={UserBoardsPage} />
        <Route exact path="/board/:id" component={() => <h1>Specific board</h1>} />
        <Route exact path="/user" component={() => <h1>User page</h1>} />
        <Route path="*" component={() => <Redirect to="/board/all" />} />
      </Switch>
    </div>
  </>
);

export default AuthenticatedRoutes;
