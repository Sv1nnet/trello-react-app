import { boardActionTypes, userActionTypes } from '../types';
import api from '../api';

const createBoard = ({ token, title, access, description }) => (dispatch, getState) => {
  return api.board.createBoard(token, { title, access, description })
    .then((res) => {
      dispatch({ type: userActionTypes.BOARD_ADDED, data: res });
      return dispatch({ type: boardActionTypes.CREATED, data: res }).data;
    })
    .catch((err) => {
      return dispatch({ type: boardActionTypes.CREATE_FAILED, data: err.response }).data;
    });
};

export default {
  createBoard,
};
