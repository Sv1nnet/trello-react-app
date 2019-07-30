/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../node_modules/bootstrap/scss/bootstrap.scss';
import './styles/App.sass';
import actions from './actions/authActions';
import GuestRoutes from './components/routes/GuestRoutes';
import AuthenticatedRoutes from './components/routes/AuthenticatedRoutes';
import Loader from './components/utils/Loader';

class App extends Component {
  state = {
    loading: true,
    isAuthenticated: false,
  }

  // We need verify user every time he comes to the app to ensure he has right to get content.
  // So we need to know what routs to show a user.
  // Here we check if token exists. If so we need verify it.
  // If token is veryfied then set state of App isAuthenticated and show AuthenticatedRoutes.
  // Otherwise set state !isAuthenticated and show GuestRoutes.
  componentDidMount() {
    const { props, state } = this;
    const { token, verifyToken } = props;

    // If user has token in redux store verify it
    if (token) {
      if (state.loading && !state.isAuthenticated) {
        verifyToken(token)
          .then(res => this.setState({ isAuthenticated: res.status === 200, loading: false }))
          .catch(() => this.setState({ isAuthenticated: false, loading: false }));
      }
    } else {
      // Otherwise stop loading and set !isAuthenticated to show GuestRoutes
      this.setState(() => ({
        isAuthenticated: false,
        loading: false,
      }));
    }
  }

  // Once we got token from redux store in props it means token is verified successfully and we set state isAuthenticated
  componentDidUpdate() {
    const { props, state } = this;
    const { token } = props;

    if (token && !state.isAuthenticated) {
      this.setState(() => ({
        isAuthenticated: true,
        loading: false,
      }));
    }
  }


  render() {
    const { state } = this;

    return (
      <div className="App">
        {state.loading && <Loader.FormLoader />}
        {state.isAuthenticated && !state.loading && <AuthenticatedRoutes />}
        {!state.isAuthenticated && !state.loading && <GuestRoutes />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.user.token ? state.user.token.token : undefined,
});

const mapDispatchToProps = dispatch => ({
  verifyToken: token => dispatch(actions.verifyToken(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
