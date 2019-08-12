import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import UserNavbar from '../navigation/UserNavbar';
import UserBoardsPage from '../pages/UserBoardsPage';
import Board from '../pages/Board';

const AuthenticatedRoutes = () => (
  <>
    <UserNavbar />
    <div className="container-fluid px-0">
      <Switch>
        <Route exact path="/board/all" component={UserBoardsPage} />
        <Route exact path="/board/:id" component={Board} />
        <Route exact path="/user" component={() => <h1>User page</h1>} />
        <Route path="*" component={() => <Redirect to="/board/all" />} />
      </Switch>
    </div>
  </>
);

export default AuthenticatedRoutes;
