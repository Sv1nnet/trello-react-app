import { cardActionTypes } from '../../types';
import api from '../../api';
import createErrorResponseObject from '../../utlis/createErrorResponseObject';

const createCard = (token, boardId, card) => (dispatch) => {
  const cardData = {
    card,
  };

  return api.board.createCard(token, boardId, cardData)
    .then((res) => {
      dispatch({ type: cardActionTypes.CARD_CREATED, data: res.data });
      return res;
    })
    .catch(err => Promise.reject(
      dispatch({
        type: cardActionTypes.CARD_CREATE_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    ));
};

const deleteCard = (token, boardId, cardId) => dispatch => api.board.deleteCard(token, boardId, cardId)
  .then((res) => {
    dispatch({ type: cardActionTypes.CARD_DELETED, data: res.data });
    return res;
  })
  .catch(err => Promise.reject(
    dispatch({
      type: cardActionTypes.CARD_DELETE_FAILED,
      data: createErrorResponseObject(err),
    }).data,
  ));

const updateCardPositions = (token, boardId, dataToUpdate) => (dispatch) => {
  const data = {
    cards: dataToUpdate.cards,
    timeOfChange: dataToUpdate.timeOfChange,
  };

  return api.board.updateCardPositions(token, boardId, data)
    .then((res) => {
      dispatch({ type: cardActionTypes.CARD_POSITIONS_UPDATED, data: res.data });
      return res;
    })
    .catch(err => Promise.reject(
      dispatch({
        type: cardActionTypes.CARD_POSITIONS_UPDATE_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    ));
};

const moveCardToNewPosition = (token, boardId, newCards) => (dispatch, getState) => {
  const timeOfChange = Date.now();
  dispatch({ type: cardActionTypes.CARD_POSITIONS_SWITCHED, data: { cards: newCards, timeOfLastChange: timeOfChange } });

  const { cards } = getState().board;
  // Save changes on the server
  return updateCardPositions(token, boardId, { cards, timeOfChange })(dispatch);
};

const updateCard = (token, boardId, cardId, dataToUpdate) => (dispatch) => {
  const data = {
    dataToUpdate,
  };

  if (dataToUpdate.title === '') return Promise.reject(new Error('Title can not be blank'));

  return api.board.updateCard(token, boardId, cardId, data)
    .then((res) => {
      dispatch({ type: cardActionTypes.CARD_UPDATED, data: res.data });
      return res;
    })
    .catch(err => Promise.reject(
      dispatch({
        type: cardActionTypes.CARD_UPDATE_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    ));
};

const addCardComment = (token, boardId, cardId, data) => dispatch => api.board.addCardComment(token, boardId, cardId, data)
  .then((res) => {
    dispatch({ type: cardActionTypes.CARD_COMMENT_ADDED, data: res.data });
    return res;
  })
  .catch(err => Promise.reject(
    dispatch({
      type: cardActionTypes.CARD_COMMENT_ADD_FALIED,
      data: createErrorResponseObject(err),
    }).data,
  ));

const updateCardComment = (token, boardId, cardId, commentId, dataToUpdate) => dispatch => api.board.updateCardComment(token, boardId, cardId, commentId, dataToUpdate)
  .then((res) => {
    dispatch({ type: cardActionTypes.CARD_COMMENT_UPDATED, data: res.data });
    return res;
  })
  .catch(err => Promise.reject(
    dispatch({
      type: cardActionTypes.CARD_UPDATE_FAILED,
      data: createErrorResponseObject(err),
    }).data,
  ));

const deleteCardComment = (token, boardId, cardId, commentId) => dispatch => api.board.deleteCardComment(token, boardId, cardId, commentId)
  .then((res) => {
    dispatch({ type: cardActionTypes.CARD_COMMENT_DELETED, data: res.data });
    return res;
  })
  .catch(err => Promise.reject(
    dispatch({
      type: cardActionTypes.CARD_COMMENT_DELETE_FALIED,
      data: createErrorResponseObject(err),
    }).data,
  ));

const attachLabel = (token, boardId, cardId, labelId) => (dispatch, getState) => {
  const timeOfChange = Date.now();
  const { board } = getState();
  const updatedBoard = {
    ...getState().board,
    timeOfLastChange: timeOfChange,
    cards: board.cards.map((card) => {
      if (card._id === cardId) {
        return { ...card, labels: [...card.labels, labelId] };
      }
      return { ...card };
    }),
  };

  // Attach label on the client
  dispatch({ type: cardActionTypes.LABEL_ATTACHED, data: updatedBoard });

  // Send request for attaching a label to the server
  return api.board.attachLabel(token, boardId, cardId, labelId, { timeOfChange })
    .then((res) => {
      dispatch({ type: cardActionTypes.CARD_LOCAL_CHANGES_UPDATED, data: res.data });
      return res;
    })
    .catch(err => Promise.reject(
      dispatch({
        type: cardActionTypes.LABEL_ATTACH_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    ));
};

const removeLabel = (token, boardId, cardId, labelId) => (dispatch, getState) => {
  const timeOfChange = Date.now();
  const { board } = getState();
  const updatedBoard = {
    ...getState().board,
    timeOfLastChange: timeOfChange,
    cards: board.cards.map((card) => {
      if (card._id === cardId) {
        return { ...card, labels: card.labels.filter(label => label !== labelId) };
      }
      return { ...card };
    }),
  };

  // Remove label on the client
  dispatch({ type: cardActionTypes.LABEL_REMOVED, data: updatedBoard });

  // Send request for removing a label to the server
  return api.board.removeLabel(token, boardId, cardId, labelId, { timeOfChange })
    .then((res) => {
      dispatch({ type: cardActionTypes.CARD_LOCAL_CHANGES_UPDATED, data: res.data });
      return res;
    })
    .catch(err => Promise.reject(
      dispatch({
        type: cardActionTypes.LABEL_REMOVE_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    ));
};


export {
  createCard,
  deleteCard,
  moveCardToNewPosition,
  updateCard,
  addCardComment,
  updateCardComment,
  deleteCardComment,
  attachLabel,
  removeLabel,
};
