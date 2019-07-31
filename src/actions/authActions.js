import { userActionTypes } from '../types';
import api from '../api';

const {
  LOGGEDIN,
  LOGGEDOUT,
  SIGNEDUP,
  EMAIL_CONFIRMED,
  RESET_PASSWORD,
  FORGOT_PASSWORD,
  TOKEN_VERIFIED,
  TOKEN_VERIFIED_FAILED,
  RESET_PASSWORD_FAILED,
  SIGNINGUP_FAILED,
  LOGGING_FAILED,
  LOGGEDOUT_FAILED,
  EMAIL_CONFIRMATION_FAILED,
  FORGOT_PASSWORD_FAILED,
} = userActionTypes;

const resetPassword = ({ token, password }) => (dispatch, getState) => {
  const data = {
    credentials: {
      password,
    },
  };

  return api.auth.resetPassword(token, data)
    .then(res => dispatch({ type: RESET_PASSWORD, data: res }).data)
    .catch(err => dispatch({ type: RESET_PASSWORD_FAILED, data: err.response }).data);
};

const forgotPassword = ({ email }) => (dispatch, getState) => {
  const data = {
    credentials: {
      email,
    },
  };

  return api.auth.forgotPassword(data)
    .then(res => dispatch({ type: FORGOT_PASSWORD, data: res }).data)
    .catch(err => dispatch({ type: FORGOT_PASSWORD_FAILED, data: err.response }).data);
};

const login = ({ email, password }) => (dispatch, getState) => {
  const data = {
    credentials: {
      email,
      password,
    },
  };

  return api.auth.login(data)
    .then(res => dispatch({ type: LOGGEDIN, data: res }).data)
    .catch((err) => {
      console.log('error', err.response);
      return dispatch({ type: LOGGING_FAILED, data: err.response }).data;
    });
};

const verifyToken = token => (dispatch, getState) => api.auth.verifyToken(token)
  .then((res) => {
    console.log('verifying');
    return dispatch({ type: TOKEN_VERIFIED, data: res }).data;
  })
  .catch((err) => {
    console.log('error', err.response);
    return dispatch({ type: TOKEN_VERIFIED_FAILED, data: err.response }).data;
  });

const logout = token => (dispatch, getState) => api.auth.logout(token)
  .then((res) => {
    dispatch({ type: LOGGEDOUT, data: res });
  })
  .catch((err) => {
    dispatch({ type: LOGGEDOUT_FAILED, data: err });
  });

// eslint-disable-next-line object-curly-newline
const signup = ({ email, password, nickname, firstName, lastName }) => (dispatch, getState) => {
  const data = {
    credentials: {
      email,
      nickname,
      password,
      firstName,
      lastName,
    },
  };

  return api.auth.signup(data)
    .then(res => dispatch({ type: SIGNEDUP, data: res }).data)
    .catch((err) => {
      console.log('error', err.response);
      return dispatch({ type: SIGNINGUP_FAILED, data: err.response }).data;
    });
};

const confirmEmail = token => (dispatch, getState) => api.auth.confirmEmail(token)
  .then((res) => {
    console.log('res of confirm email', res);
    return dispatch({ type: EMAIL_CONFIRMED, data: res }).data;
  })
  .catch((err) => {
    console.log('error of confirm email', err.response);
    return dispatch({ type: EMAIL_CONFIRMATION_FAILED, data: err.response }).data;
  });

export default {
  login,
  signup,
  verifyToken,
  forgotPassword,
  resetPassword,
  logout,
  confirmEmail,
};
