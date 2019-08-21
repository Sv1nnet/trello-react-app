/* eslint-disable arrow-body-style */
import { userActionTypes } from '../types';
import api from '../api';
import createErrorResponseObject from '../utlis/createErrorResponseObject';

const {
  LOGGEDIN,
  LOGGEDOUT,
  SIGNEDUP,
  EMAIL_CONFIRMED,
  RESET_PASSWORD,
  FORGOT_PASSWORD,
  TOKEN_VERIFIED,
  VERIFY_TOKEN_FAILED,
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
    .then((res) => {
      return dispatch({ type: RESET_PASSWORD, data: res }).data;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: RESET_PASSWORD_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const forgotPassword = ({ email }) => (dispatch, getState) => {
  const data = {
    credentials: {
      email,
    },
  };

  return api.auth.forgotPassword(data)
    .then((res) => {
      return dispatch({ type: FORGOT_PASSWORD, data: res }).data;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: FORGOT_PASSWORD_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const login = ({ email, password }) => (dispatch, getState) => {
  const data = {
    credentials: {
      email,
      password,
    },
  };

  return api.auth.login(data)
    .then((res) => {
      return dispatch({ type: LOGGEDIN, data: res }).data;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: LOGGING_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const verifyToken = token => (dispatch, getState) => api.auth.verifyToken(token)
  .then((res) => {
    return dispatch({ type: TOKEN_VERIFIED, data: res }).data;
  })
  .catch((err) => {
    return Promise.reject(
      dispatch({
        type: VERIFY_TOKEN_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    );
  });

const logout = token => (dispatch, getState) => api.auth.logout(token)
  .then((res) => {
    dispatch({ type: LOGGEDOUT, data: res });
  })
  .catch((err) => {
    return Promise.reject(
      dispatch({
        type: LOGGEDOUT_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    );
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
    .then((res) => {
      return dispatch({ type: SIGNEDUP, data: res }).data;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: SIGNINGUP_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const confirmEmail = token => (dispatch, getState) => api.auth.confirmEmail(token)
  .then((res) => {
    return dispatch({ type: EMAIL_CONFIRMED, data: res }).data;
  })
  .catch((err) => {
    return Promise.reject(
      dispatch({
        type: EMAIL_CONFIRMATION_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    );
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
