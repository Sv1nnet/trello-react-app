import { userActionTypes } from '../../types';
import api from '../../api';
import createErrorResponseObject from '../../utlis/createErrorResponseObject';

const editAccount = (token, boardId, userData) => (dispatch) => {
  const data = {
    userData,
  };

  return api.user.editAccount(token, boardId, data)
    .then((res) => {
      dispatch({ type: userActionTypes.ACCOUNT_EDITED, data: res.data });
      return res;
    })
    .catch(err => Promise.reject(
      dispatch({
        type: userActionTypes.ACCOUNT_EDIT_FAILED,
        data: createErrorResponseObject(err),
      }).data,
    ));
};

export { editAccount };
