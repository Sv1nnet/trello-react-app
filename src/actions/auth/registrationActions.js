import { userActionTypes } from '../../types';
import api from '../../api';
import createErrorResponseObject from '../../utlis/createErrorResponseObject';

const {
  SIGNEDUP,
  EMAIL_CONFIRMED,
  SIGNINGUP_FAILED,
  EMAIL_CONFIRMATION_FAILED,
} = userActionTypes;

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
      dispatch({ type: SIGNEDUP, data: res.data });
      return res;
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
    dispatch({ type: EMAIL_CONFIRMED, data: res.data });
    return res;
  })
  .catch((err) => {
    return Promise.reject(
      dispatch({
        type: EMAIL_CONFIRMATION_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    );
  });

export {
  signup,
  confirmEmail,
};
