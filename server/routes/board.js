/* eslint-disable no-underscore-dangle */
const express = require('express');

// Board
const getUserBoards = require('./board/getUserBoards');
const getBoardById = require('./board/getBoardById');
const updateBoardSetting = require('./board/updateBoardSetting');
const createBoard = require('./board/createBoard');
const deleteBoard = require('./board/deleteBoard');
const removeBoard = require('./board/removeBoard');
const updateLabel = require('./board/updateLabel');
const getActivities = require('./board/getActivities');

// Members
const findUsers = require('./members/findUsers');
const addMember = require('./members/addMember');
const removeMember = require('./members/removeMember');
const getBoardMembers = require('./members/getBoardMembers');

// Columns
const createColumn = require('./columns/createColumn');
const deleteColumn = require('./columns/deleteColumn');
const updateColumn = require('./columns/updateColumn');
const updateColumnPositions = require('./columns/updateColumnPositions');

// Cards
const createCard = require('./cards/createCard');
const deleteCard = require('./cards/deleteCard');
const updateCard = require('./cards/updateCard');
const updateCardPositions = require('./cards/updateCardPositions');
const addCardComment = require('./cards/addCardComment');
const deleteCardComment = require('./cards/deleteCardComment');
const updateCardComment = require('./cards/updateCardComment');
const attachLabel = require('./cards/attachLabel');
const removeLabel = require('./cards/removeLabel');

const { parseError } = require('../utils/parseError');

const router = express.Router();

// Board routes
router.get('/all', getUserBoards);
router.get('/:id', getBoardById);
router.post('/:id', updateBoardSetting);
router.post('/', createBoard);
router.post('/:id/delete', deleteBoard);
router.post('/:id/remove', removeBoard);
router.post('/:id/update_label/:labelId', updateLabel);
router.get('/:id/get_activities', getActivities);

// Members routes
router.get('/find_users/:email', findUsers);
router.post('/:id/add_member', addMember);
router.post('/:id/remove_member', removeMember);
router.get('/:id/get_members', getBoardMembers);

// Column routes
router.post('/:id/create_column', createColumn);
router.post('/:id/delete_column/:columnId', deleteColumn);
router.post('/:id/update_column/:columnId', updateColumn);
router.post('/:id/update_column_positions', updateColumnPositions);

// Card routes
router.post('/:id/create_card', createCard);
router.post('/:id/delete_card/:cardId', deleteCard);
router.post('/:id/update_card/:cardId', updateCard);
router.post('/:id/update_card_positions', updateCardPositions);
router.post('/:id/add_comment/:cardId', addCardComment);
router.post('/:id/:cardId/delete_comment/:commentId', deleteCardComment);
router.post('/:id/:cardId/update_comment/:commentId', updateCardComment);
router.post('/:id/:cardId/attach_label/:labelId', attachLabel);
router.post('/:id/:cardId/remove_label/:labelId', removeLabel);

module.exports = {
  boardRouter: router,
};
