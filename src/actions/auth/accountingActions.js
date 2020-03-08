import { userActionTypes } from '../../types';
import api from '../../api';
import createErrorResponseObject from '../../utlis/createErrorResponseObject';

const {
  LOGGEDIN,
  LOGGEDOUT,
  TOKEN_VERIFIED,
  VERIFY_TOKEN_FAILED,
  LOGGING_FAILED,
  LOGGEDOUT_FAILED,
} = userActionTypes;

const login = ({ email, password }) => (dispatch) => {
  const data = {
    credentials: {
      email,
      password,
    },
  };

  return api.auth.login(data)
    .then((res) => {
      dispatch({ type: LOGGEDIN, data: res.data });
      return res;
    })
    .catch(err => Promise.reject(
      dispatch({
        type: LOGGING_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    ));
};

const verifyToken = token => dispatch => api.auth.verifyToken(token)
  .then((res) => {
    dispatch({ type: TOKEN_VERIFIED, data: res.data });
    return res;
  })
  .catch(err => Promise.reject(
    dispatch({
      type: VERIFY_TOKEN_FAILED,
      data: createErrorResponseObject(err),
    }).data,
  ));

const logout = token => dispatch => api.auth.logout(token)
  .then((res) => {
    dispatch({ type: LOGGEDOUT, data: res.data });
  })
  .catch(err => Promise.reject(
    dispatch({
      type: LOGGEDOUT_FAILED,
      data: createErrorResponseObject(err),
    }).data,
  ));

export {
  login,
  verifyToken,
  logout,
};
