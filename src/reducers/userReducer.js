/* eslint-disable no-underscore-dangle */
/*
 * Data we get from server once user logged in
 * {
 *   config: axios config object,
 *   data: {
 *     boards: [{ id, title }],
 *     email: 'email@email.ru',
 *     firstName: 'First',
 *     lastName: 'Last',
 *     nickname: 'Nick',
 *     token: {
 *       access: 'type',
 *       token: 'jsonwebtoken',
 *     }
 *     _id: 'idofuserinmongodb',
 *   },
 *   headers: { header-name: 'header-content' },
 *   request: XMLHttpRequest object,
 *   status: status code (200 for example),
 *   statusText: 'OK' for example,
 * }
 */
import { userActionTypes } from '../types';

const user = localStorage.getItem('user');
const initialState = user ? JSON.parse(user) : {
  userData: {},
  token: {},
};

const userReducer = (state = initialState, action) => {
  let data;
  let newState;
  console.log(action);
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
          lastName: data.lastName,
          boards: [
            // {
            //   id: 'idnumberone',
            //   title: 'Board one',
            // },
            // {
            //   id: 'idnumbertwo',
            //   title: 'Board two',
            // },
            // {
            //   id: 'idnumberthree',
            //   title: 'Board three',
            // },
          ],
        },
        token: data.token,
      };
      localStorage.setItem('user', JSON.stringify(newState));
      console.log('new state', newState);

      return newState;
    case userActionTypes.LOGGEDOUT:
      return {
        ...initialState,
      };
    case userActionTypes.EMAIL_CONFIRMATION_FAILED:
      return {
        ...state,
      };
    default:
      return { ...state };
  }
};

export default userReducer;
