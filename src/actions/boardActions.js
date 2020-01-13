import {
  createBoard,
  loadAllBoards,
  getBoard,
  updateBoard,
  clearBoardData,
  getActivities,
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
  switchCardPositions,
  clearBoardData,
  getActivities,
};
