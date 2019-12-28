import { boardActionTypes, userActionTypes, columnActionTypes, cardActionTypes } from '../types';
import api from '../api';
import createErrorResponseObject from '../utlis/createErrorResponseObject';

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

const findUsers = (token, email) => (dispatch) => {
  const encodedEmail = window.encodeURIComponent(email);

  return api.board.findUsers(token, encodedEmail)
    .then((res) => {
      dispatch({ type: boardActionTypes.BOARD_USERS_FOUND, data: res.data });
      return res;
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

const getMembers = (token, id) => (dispatch) => {
  return api.board.getMembers(token, id)
    .then((res) => {
      dispatch({ type: boardActionTypes.BOARD_MEMBERS_RECEIVED, data: res.data });
      return res;
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

const addMember = (token, id, userId) => (dispatch) => {
  const data = {
    member: userId,
  };

  return api.board.addMember(token, id, data)
    .then((res) => {
      dispatch({ type: boardActionTypes.BOARD_MEMBER_ADDED, data: res.data });
      return res;
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

const removeMember = (token, id, userId) => (dispatch) => {
  const data = {
    member: userId,
  };

  return api.board.removeMember(token, id, data)
    .then((res) => {
      dispatch({ type: boardActionTypes.BOARD_MEMBER_REMOVED, data: res.data });
      return res;
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

const createColumn = (token, boardId, column) => (dispatch) => {
  const columnData = {
    column,
  };

  return api.board.createColumn(token, boardId, columnData)
    .then((res) => {
      dispatch({ type: columnActionTypes.COLUMN_CREATED, data: res.data });
      return res;
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

const deleteColumn = (token, boardId, columnId) => (dispatch) => {
  return api.board.deleteColumn(token, boardId, columnId)
    .then((res) => {
      dispatch({ type: columnActionTypes.COLUMN_DELETED, data: res.data });
      return res;
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

const updateColumn = (token, boardId, columnId, dataToUpdate) => (dispatch) => {
  const data = {
    dataToUpdate,
  };

  if (dataToUpdate.title === '') return Promise.reject(new Error('Title can not be blank'));

  return api.board.updateColumn(token, boardId, columnId, data)
    .then((res) => {
      dispatch({ type: columnActionTypes.COLUMN_UPDATED, data: res.data });
      return res;
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

// Send new column positions to the server
const updateColumnPositions = (token, boardId, dataToUpdate) => (dispatch) => {
  const data = {
    columns: dataToUpdate,
  };

  return api.board.updateColumnPositions(token, boardId, data)
    .then((res) => {
      dispatch({ type: columnActionTypes.COLUMN_POSITIONS_UPDATED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: columnActionTypes.COLUMN_POSITIONS_UPDATE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const switchColumnPositions = (token, boardId, newColumns) => (dispatch, getState) => {
  // Save changes locally
  dispatch({ type: columnActionTypes.COLUMN_POSITIONS_SWITCHED, data: { columns: newColumns } });

  const { columns } = getState().board;
  // Save changes on the server
  return updateColumnPositions(token, boardId, columns)(dispatch);
};

const createCard = (token, boardId, card) => (dispatch) => {
  const cardData = {
    card,
  };

  return api.board.createCard(token, boardId, cardData)
    .then((res) => {
      dispatch({ type: cardActionTypes.CARD_CREATED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: cardActionTypes.CARD_CREATE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const deleteCard = (token, boardId, cardId) => (dispatch) => {
  return api.board.deleteCard(token, boardId, cardId)
    .then((res) => {
      dispatch({ type: cardActionTypes.CARD_DELETED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: cardActionTypes.CARD_DELETE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const updateCardPositions = (token, boardId, dataToUpdate) => (dispatch) => {
  const data = {
    columns: dataToUpdate,
  };

  return api.board.updateCardPositions(token, boardId, data)
    .then((res) => {
      dispatch({ type: cardActionTypes.CARD_POSITIONS_UPDATED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: cardActionTypes.CARD_POSITIONS_UPDATE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

const switchCardPositions = newCards => (dispatch) => {
  dispatch({ type: cardActionTypes.CARD_POSITIONS_SWITCHED, data: { cards: newCards } });
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
  switchColumnPositions,
  updateColumnPositions,
  createCard,
  deleteCard,
  switchCardPositions,
  updateCardPositions,
};
