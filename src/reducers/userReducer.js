/*
 * Data we get from server once user logged in
 * {
 *   config: axios config object,
 *   data: {
 *     boards: [{ id, title, owner }],
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

  switch (action.type) {
    case userActionTypes.SIGNEDUP:
      return {
        ...state,
      };
    case userActionTypes.TOKEN_VERIFIED:
      data = { ...action.data };
      return {
        ...state,
        userData: {
          ...state.userData,
          boards: data.boards,
        },
      };
    case userActionTypes.BOARD_TITLE_UPDATED:
      data = { ...action.data };
      return {
        ...state,
        userData: {
          ...state.userData,
          boards: state.userData.boards.map((board) => {
            if (board._id === data._id) {
              return {
                ...board,
                title: data.title,
              };
            }
            return board;
          }),
        },
      };
    case userActionTypes.BOARD_ADDED:
      data = { ...action.data };
      return {
        ...state,
        userData: {
          ...state.userData,
          boards: [...state.userData.boards, { _id: data._id, title: data.title }],
        },
      };
    case userActionTypes.ACCOUNT_EDITED:
    case userActionTypes.EMAIL_CONFIRMED:
    case userActionTypes.LOGGEDIN:
      data = { ...action.data };
      newState = {
        ...state,
        userData: {
          _id: data._id,
          email: data.email,
          nickname: data.nickname,
          firstName: data.firstName,
          lastName: data.lastName,
          boards: data.boards,
        },
        token: data.token,
      };
      localStorage.setItem('user', JSON.stringify(newState));

      return {
        ...newState,
      };
    case userActionTypes.LOGGEDOUT:
      return {
        userData: {},
        token: {},
      };

    case userActionTypes.VERIFY_TOKEN_FAILED:
      localStorage.setItem('user', '');

      return {
        userData: {},
        token: {},
      };
    case userActionTypes.ACCOUNT_EDIT_FAILED:
    case userActionTypes.EMAIL_CONFIRMATION_FAILED:
      return {
        ...state,
      };
    case userActionTypes.BOARD_REMOVED:
    case userActionTypes.BOARD_DELETED:
    case userActionTypes.ALL_BOARDS_DOWNLOADED:
      data = { ...action.data };
      return {
        ...state,
        userData: {
          ...state.userData,
          boards: [...data.boards],
        },
      };
    default:
      return {
        ...state,
      };
  }
};

export default userReducer;
