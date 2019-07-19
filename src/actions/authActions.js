import axios from 'axios';
import setAuthHeaders from '../utlis/setAuthHeaders';
import {
  USER_LOGGEDIN,
  USER_LOGGEDOUT,
  USER_SIGNEDUP,
  SIGNINGUP_FAILED,
} from '../types';

const login = ({ email, password }) => (dispatch, getState) => {

};
// { email, password, login, firstName, lastName }
const signup = userData => (dispatch, getState) => {
  axios.post('/user/signup', userData)
    .then((res) => {
      dispatch({ type: USER_SIGNEDUP, data: res.data });
    })
    .catch((err) => {
      dispatch({ type: SIGNINGUP_FAILED, data: err });
    });
};

export default {
  login,
  signup,
};
