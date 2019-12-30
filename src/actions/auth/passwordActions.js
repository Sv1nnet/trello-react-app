import { userActionTypes } from '../../types';
import api from '../../api';
import createErrorResponseObject from '../../utlis/createErrorResponseObject';

const {
  RESET_PASSWORD,
  FORGOT_PASSWORD,
  RESET_PASSWORD_FAILED,
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
      dispatch({ type: RESET_PASSWORD, data: res.data });
      return res;
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
      dispatch({ type: FORGOT_PASSWORD, data: res.data });
      return res;
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

export {
  resetPassword,
  forgotPassword,
};
