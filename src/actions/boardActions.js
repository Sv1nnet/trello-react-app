import {
  createBoard,
  loadAllBoards,
  getBoard,
  updateBoard,
  clearBoardData,
  getActivities,
  cleanActivities,
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
} from './board/cardActions';
import {
  getMembers,
  findUsers,
  addMember,
  removeMember,
} from './board/membersActions';

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
  switchCardPositions,
  clearBoardData,
  getActivities,
  cleanActivities,
};
