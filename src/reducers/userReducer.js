import types from '../types';

const user = localStorage.getItem('user');
const initialState = user ? JSON.parse(user) : {
  userData: {},
  token: {},
};

const userReducer = (state = initialState, action) => {
  let data;
  let newState;
  switch (action.type) {
    case types.SIGNEDUP:
      return {
        ...state,
      };
    case types.EMAIL_CONFIRMED:
    case types.LOGGEDIN:
      data = { ...action.data.data };
      newState = {
        ...state,
        userData: {
          email: data.email,
          nickName: data.nickName,
          firstName: data.firstName,
          secondName: data.secondName,
          boards: [],
        },
        token: data.token,
      };
      localStorage.setItem('user', JSON.stringify(newState));

      return newState;
    case types.EMAIL_CONFIRMATION_FAILED:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default userReducer;
