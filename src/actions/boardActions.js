import { boardActionTypes, userActionTypes, columnActionTypes } from '../types';
import api from '../api';
import createErrorResponseObject from '../utlis/createErrorResponseObject';

const createBoard = ({ token, title, access, description }) => (dispatch, getState) => {
  return api.board.createBoard(token, { title, access, description })
    .then((res) => {
      dispatch({ type: userActionTypes.BOARD_ADDED, data: res }); // Add board to user reducer
      return dispatch({ type: boardActionTypes.CREATED, data: res }).data;
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
            data: {
              ...board,
              title: currentBoard.title,
            },
          },
        });
      }
      return dispatch({ type: userActionTypes.ALL_BOARDS_DOWNLOADED, data: res }).data;
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

const getBoard = (token, id) => (dispatch, getState) => {
  return api.board.getBoard(token, id)
    .then((res) => {
      return dispatch({ type: boardActionTypes.BOARD_DOWNLOADED, data: res }).data;
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

const updateBoard = (token, id, data) => (dispatch, getState) => {
  return api.board.updateBoard(token, id, data)
    .then((res) => {
      dispatch({ type: userActionTypes.BOARD_TITLE_UPDATED, data: res });
      return dispatch({ type: boardActionTypes.BOARD_UPDATED, data: res }).data;
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

const findUsers = (token, email) => (dispatch, getState) => {
  const encodedEmail = window.encodeURIComponent(email);

  return api.board.findUsers(token, encodedEmail)
    .then((res) => {
      return dispatch({ type: boardActionTypes.BOARD_USERS_FOUND, data: res }).data;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: boardActionTypes.BOARD_FIND_USERS_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const getMembers = (token, id) => (dispatch, getState) => {
  return api.board.getMembers(token, id)
    .then((res) => {
      return dispatch({ type: boardActionTypes.BOARD_MEMBERS_RECEIVED, data: res }).data;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: boardActionTypes.BOARD_MEMBERS_RECEIVE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const addMember = (token, id, userId) => (dispatch, getState) => {
  const data = {
    member: userId,
  };

  return api.board.addMember(token, id, data)
    .then((res) => {
      return dispatch({ type: boardActionTypes.BOARD_MEMBER_ADDED, data: res }).data;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: boardActionTypes.BOARD_MEMBER_ADD_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const removeMember = (token, id, userId) => (dispatch, getState) => {
  const data = {
    member: userId,
  };

  return api.board.removeMember(token, id, data)
    .then((res) => {
      return dispatch({ type: boardActionTypes.BOARD_MEMBER_REMOVED, data: res }).data;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: boardActionTypes.BOARD_MEMBER_REMOVE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const createColumn = (token, boardId, column) => (dispatch, getState) => {
  const columnData = {
    column,
  };

  return api.board.createColumn(token, boardId, columnData)
    .then((res) => {
      return dispatch({ type: columnActionTypes.COLUMN_CREATED, data: res }).data;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: columnActionTypes.COLUMN_CREATE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const deleteColumn = (token, boardId, columnId) => (dispatch, getState) => {
  return api.board.deleteColumn(token, boardId, columnId)
    .then((res) => {
      return dispatch({ type: columnActionTypes.COLUMN_DELETED, data: res }).data;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: columnActionTypes.COLUMN_DELETE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const updateColumn = (token, boardId, columnId, dataToUpdate) => (dispatch, getState) => {
  const data = {
    dataToUpdate,
  };

  if (dataToUpdate.title === '') return Promise.reject(new Error('Title can not be blank'));

  return api.board.updateColumn(token, boardId, columnId, data)
    .then((res) => {
      return dispatch({ type: columnActionTypes.COLUMN_UPDATED, data: res }).data;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: columnActionTypes.COLUMN_UPDATE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

export default {
  createBoard,
  loadAllBoards,
  getBoard,
  updateBoard,
  getMembers,
  findUsers,
  addMember,
  removeMember,
  createColumn,
  deleteColumn,
  updateColumn,
};
