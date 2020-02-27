import {
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
} from './board/boardActions';
import {
  createColumn,
  deleteColumn,
  updateColumn,
  switchColumnPositions,
} from './board/columnActions';
import {
  createCard,
  deleteCard,
  switchCardPositions,
  updateCard,
  addCardComment,
  deleteCardComment,
  updateCardComment,
  attachLabel,
  removeLabel,
} from './board/cardActions';
import {
  getMembers,
  findUsers,
  addMember,
  removeMember,
} from './board/membersActions';
import {
  editAccount,
} from './user/userActions';

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
  createCard,
  deleteCard,
  updateCard,
  addCardComment,
  deleteCardComment,
  updateCardComment,
  switchCardPositions,
  clearBoardData,
  getActivities,
  cleanActivities,
  updateLabel,
  attachLabel,
  removeLabel,
  deleteBoard,
  removeBoard,
  editAccount,
};
