/* eslint-disable arrow-body-style */
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
    cards: dataToUpdate.cards,
    timeOfChange: dataToUpdate.timeOfChange,
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

const switchCardPositions = (token, boardId, newCards) => (dispatch, getState) => {
  const timeOfChange = Date.now();
  dispatch({ type: cardActionTypes.CARD_POSITIONS_SWITCHED, data: { cards: newCards, timeOfLastChange: timeOfChange } });

  const { cards } = getState().board;
  // Save changes on the server
  return updateCardPositions(token, boardId, { cards, timeOfChange })(dispatch);
};

const updateCard = (token, boardId, cardId, dataToUpdate) => (dispatch, getState) => {
  const data = {
    dataToUpdate,
  };

  if (dataToUpdate.title === '') return Promise.reject(new Error('Title can not be blank'));

  return api.board.updateCard(token, boardId, cardId, data)
    .then((res) => {
      dispatch({ type: cardActionTypes.CARD_UPDATED, data: res.data });
      return res;
    })
    .catch((err) => {
      return Promise.reject(
        dispatch({
          type: cardActionTypes.CARD_UPDATE_FAILED,
          data: createErrorResponseObject(err),
        }).data,
      );
    });
};

export {
  createCard,
  deleteCard,
  switchCardPositions,
  updateCard,
};
