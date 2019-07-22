import React from 'react';
import { connect } from 'react-redux';
import '../node_modules/bootstrap/scss/bootstrap.scss';
import './styles/App.sass';
import GuestRoutes from './components/routes/GuestRoutes';
import AuthenticatedRoutes from './components/routes/AuthenticatedRoutes';

function App(props) {
  const { isAuthenticated } = props;

  return (
    <div className="App">
      {isAuthenticated ? <AuthenticatedRoutes /> : <GuestRoutes />}
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: !!state.user.token.token, // If there is a token then user is authenticated
});

export default connect(mapStateToProps)(App);
