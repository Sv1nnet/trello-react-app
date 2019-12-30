import { boardActionTypes, userActionTypes } from '../../types';
import api from '../../api';
import createErrorResponseObject from '../../utlis/createErrorResponseObject';

const createBoard = ({ token, title, access, description }) => (dispatch) => {
  return api.board.createBoard(token, { title, access, description })
    .then((res) => {
      dispatch({ type: userActionTypes.BOARD_ADDED, data: res.data }); // Add board to user reducer
      dispatch({ type: boardActionTypes.CREATED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: boardActionTypes.CREATE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const loadAllBoards = token => (dispatch, getState) => {
  return api.board.loadAllBoards(token)
    .then((res) => {
      const { board } = getState();
      const currentBoard = res.data.boards.find(responseBoard => responseBoard._id === board._id);
      if (currentBoard) {
        dispatch({
          type: boardActionTypes.BOARD_UPDATED,
          data: {
            ...board,
            title: currentBoard.title,
          },
        });
      }

      dispatch({ type: userActionTypes.ALL_BOARDS_DOWNLOADED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: userActionTypes.ALL_BOARDS_DOWNLOADING_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const getBoard = (token, id) => (dispatch) => {
  return api.board.getBoard(token, id)
    .then((res) => {
      dispatch({ type: boardActionTypes.BOARD_DOWNLOADED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: boardActionTypes.BOARD_DOWNLOAD_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const updateBoard = (token, id, data) => (dispatch) => {
  return api.board.updateBoard(token, id, data)
    .then((res) => {
      dispatch({ type: userActionTypes.BOARD_TITLE_UPDATED, data: res.data });
      dispatch({ type: boardActionTypes.BOARD_UPDATED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: boardActionTypes.BOARD_UPDATE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

export {
  createBoard,
  loadAllBoards,
  getBoard,
  updateBoard,
};
