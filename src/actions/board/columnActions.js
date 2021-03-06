import { columnActionTypes } from '../../types';
import api from '../../api';
import createErrorResponseObject from '../../utlis/createErrorResponseObject';

const createColumn = (token, boardId, column) => (dispatch) => {
  const columnData = {
    column,
  };

  return api.board.createColumn(token, boardId, columnData)
    .then((res) => {
      dispatch({ type: columnActionTypes.COLUMN_CREATED, data: res.data });
      return res;
    })
    .catch(err => Promise.reject(
      dispatch({
        type: columnActionTypes.COLUMN_CREATE_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    ));
};

const deleteColumn = (token, boardId, columnId) => dispatch => api.board.deleteColumn(token, boardId, columnId)
  .then((res) => {
    dispatch({ type: columnActionTypes.COLUMN_DELETED, data: res.data });
    return res;
  })
  .catch(err => Promise.reject(
    dispatch({
      type: columnActionTypes.COLUMN_DELETE_FAILED,
      data: createErrorResponseObject(err),
    }).data,
  ));

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
    .catch(err => Promise.reject(
      dispatch({
        type: columnActionTypes.COLUMN_UPDATE_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    ));
};

// Send new column positions to the server
const updateColumnPositions = (token, boardId, dataToUpdate) => (dispatch) => {
  const data = {
    columns: dataToUpdate.columns,
    timeOfChange: dataToUpdate.timeOfChange,
  };

  return api.board.updateColumnPositions(token, boardId, data)
    .then((res) => {
      dispatch({ type: columnActionTypes.COLUMN_POSITIONS_UPDATED, data: res.data });
      return res;
    })
    .catch(err => Promise.reject(
      dispatch({
        type: columnActionTypes.COLUMN_POSITIONS_UPDATE_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    ));
};

const moveColumnToNewPosition = (token, boardId, newColumns) => (dispatch, getState) => {
  const timeOfChange = Date.now();

  // Save changes locally
  dispatch({ type: columnActionTypes.COLUMN_POSITIONS_SWITCHED, data: { columns: newColumns, timeOfLastChange: timeOfChange } });

  const { columns } = getState().board;
  // Save changes on the server
  return updateColumnPositions(token, boardId, { columns, timeOfChange })(dispatch);
};

export {
  createColumn,
  deleteColumn,
  updateColumn,
  moveColumnToNewPosition,
};
