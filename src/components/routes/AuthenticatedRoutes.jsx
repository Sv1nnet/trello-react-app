import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import UserNavbar from '../navigation/UserNavbar';
import UserBoardsPage from '../pages/UserBoardsPage';
import Board from '../pages/Board';
import BoardContentContextProvider from '../context/BoardContentContext';
import EditAccountPage from '../pages/EditAccountPage';

const AuthenticatedRoutes = () => (
  <>
    <BoardContentContextProvider>
      <UserNavbar />
      <div className="container-fluid px-0 h-100">
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
