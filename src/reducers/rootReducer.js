import { combineReducers } from 'redux';
import userReducer from './userReducer';
import boardReducer from './boardReducer';

const rootReducer = combineReducers({
  user: userReducer,
  board: boardReducer,
});

export default rootReducer;
