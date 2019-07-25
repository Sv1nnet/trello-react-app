import { boardActionTypes } from '../types';


const initialState = {
  id: '',
  owner: '',
  history: [],
  description: '',
  private: undefined,
  marks: [],
  chat: '',
  cards: [],
  members: [],
  readOnly: undefined,
  columns: [],
};

const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case boardActionTypes.DOWNLOADED:
      return {
        ...state,
      };

    default:
      return { ...state };
  }
};

export default boardReducer;
