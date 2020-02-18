import { boardActionTypes, userActionTypes } from '../../types';
import api from '../../api';
import createErrorResponseObject from '../../utlis/createErrorResponseObject';

const clearBoardData = () => dispatch => dispatch({ type: boardActionTypes.CLEAR_BOARD_DATA, data: null });

const createBoard = ({ token, title, access, description }) => (dispatch) => {
  return api.board.createBoard(token, { title, access, description })
    .then((res) => {
      dispatch({ type: userActionTypes.BOARD_ADDED, data: res.data }); // Add board to user reducer
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

const deleteBoard = (token, boardId) => (dispatch) => {
  return api.board.deleteBoard(token, boardId)
    .then((res) => {
      dispatch({ type: userActionTypes.BOARD_DELETED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: userActionTypes.BOARD_DELETE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const removeBoard = (token, boardId) => (dispatch, getState) => {
  return api.board.removeBoard(token, boardId)
    .then((res) => {
      const downloadedBoard = getState().board;
      const { userData } = res.data;
      const { board } = res.data;

      if (downloadedBoard._id === boardId) dispatch({ type: boardActionTypes.BOARD_REMOVED, data: board });
      dispatch({ type: userActionTypes.BOARD_REMOVED, data: userData });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: userActionTypes.BOARD_REMOVE_FAILED,
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

const getBoard = (token, boardId) => (dispatch) => {
  return api.board.getBoard(token, boardId)
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

const updateBoard = (token, boardId, data) => (dispatch) => {
  return api.board.updateBoard(token, boardId, data)
    .then((res) => {
      if (data.title) dispatch({ type: userActionTypes.BOARD_TITLE_UPDATED, data: res.data });
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

const getActivities = (token, boardId, data) => (dispatch) => {
  return api.board.getActivities(token, boardId, data)
    .then((res) => {
      dispatch({ type: boardActionTypes.ACTIVITIES_LOADED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: boardActionTypes.ACTIVITIES_LOADING_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const cleanActivities = () => dispatch => dispatch({ type: boardActionTypes.CLEAN_ACTIVITIES, data: null });

const updateLabel = (token, boardId, labelId, data) => (dispatch) => {
  return api.board.updateLabel(token, boardId, labelId, data)
    .then((res) => {
      dispatch({ type: boardActionTypes.LABEL_UPDATED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: boardActionTypes.LABEL_UPDATE_FAILED,
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
  clearBoardData,
  getActivities,
  cleanActivities,
  updateLabel,
  deleteBoard,
  removeBoard,
};
