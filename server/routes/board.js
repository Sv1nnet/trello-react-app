/* eslint-disable no-underscore-dangle */
const express = require('express');

// Board
const getUserBoards = require('./board/getUserBoards');
const getBoardById = require('./board/getBoardById');
const updateBoardSetting = require('./board/updateBoardSetting');
const createBoard = require('./board/createBoard');
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
const updateCardPositions = require('./cards/updateCardPositions');

const { parseError } = require('../utils/parseError');

const router = express.Router();

// Board routes
router.get('/all', getUserBoards);
router.get('/:id', getBoardById);
router.post('/:id', updateBoardSetting);
router.post('/', createBoard);
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
router.post('/:id/update_card_positions', updateCardPositions);

module.exports = {
  boardRouter: router,
};
