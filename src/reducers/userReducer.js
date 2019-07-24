/* eslint-disable no-underscore-dangle */
import { userActionTypes } from '../types';

const user = localStorage.getItem('user');
const initialState = user ? JSON.parse(user) : {
  userData: {},
  token: {},
};

const userReducer = (state = initialState, action) => {
  let data;
  let newState;
  switch (action.type) {
    case userActionTypes.SIGNEDUP:
      return {
        ...state,
      };
    case userActionTypes.EMAIL_CONFIRMED:
    case userActionTypes.LOGGEDIN:
      data = { ...action.data.data };
      newState = {
        ...state,
        userData: {
          _id: data._id,
          email: data.email,
          nickname: data.nickname,
          firstName: data.firstName,
          secondName: data.secondName,
          boards: [],
        },
        token: data.token,
      };
      localStorage.setItem('user', JSON.stringify(newState));
      console.log('new state', newState);

      return newState;
    case userActionTypes.EMAIL_CONFIRMATION_FAILED:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default userReducer;
