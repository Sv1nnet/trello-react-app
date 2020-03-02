// React/Redux components
import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

// Custom components
import UserNavbar from '../navigation/UserNavbar';
import UserBoardsPage from '../pages/UserBoardsPage';
import Board from '../pages/Board';
import EditAccountPage from '../pages/EditAccountPage';

// Context
import BoardContentContextProvider from '../context/BoardContentContext';

const AuthenticatedRoutes = () => (
  <>
    <BoardContentContextProvider>
      <UserNavbar />
      <div className="container-fluid px-0">
        <Switch>
          <Route exact path="/board/all" component={UserBoardsPage} />
          <Route exact path="/board/:id" component={Board} />
          <Route exact path="/user" component={EditAccountPage} />
          <Route path="*" component={() => <Redirect to="/board/all" />} />
        </Switch>
      </div>
    </BoardContentContextProvider>
  </>
);

export default AuthenticatedRoutes;
