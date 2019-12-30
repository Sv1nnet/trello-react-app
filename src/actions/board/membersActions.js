import { boardActionTypes } from '../../types';
import api from '../../api';
import createErrorResponseObject from '../../utlis/createErrorResponseObject';

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

export {
  findUsers,
  getMembers,
  addMember,
  removeMember,
};
