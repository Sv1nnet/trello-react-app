import React, { useState } from 'react';
import { connect } from 'react-redux';
import '../node_modules/bootstrap/scss/bootstrap.scss';
import './styles/App.sass';
import api from './api';
import GuestRoutes from './components/routes/GuestRoutes';
import AuthenticatedRoutes from './components/routes/AuthenticatedRoutes';

function App(props) {
  // TODO: verify token before render AuthenticatedRoutes
  const [state, setState] = useState({
    loading: true,
  });
  const { isAuthenticated, token } = props;

  // if (isAuthenticated && state.loading) {
  //   api.auth.verify(token)
  //     .then(res => setState({ isAuthenticated: res.status === 200, loading: false }))
  //     .catch(err => setState({ isAuthenticated: false, loading: false }));
  // }

  return (
    <div className="App">
      {isAuthenticated ? <AuthenticatedRoutes /> : <GuestRoutes />}
    </div>
  );
}

const mapStateToProps = (state) => {
  const token = state.user.token ? state.user.token.token : undefined;
  return {
    token,
    isAuthenticated: !!token, // If there is a token then user is authenticated
  };
};

// const mapDispatchToProps = (state)

export default connect(mapStateToProps)(App);
