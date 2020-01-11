/* eslint-disable object-curly-newline */
const { Activity } = require('../models/Activity');
const { User } = require('../models/User');
const { Board } = require('../models/Board');

/**
 * These are data you need to pass with data in action:
 * 1) for board actions: addMember, removeMember - "name" is a name of the member; title, isPrivate, isReadonly - new properies of the board;
 * 2) for column actions: create - "name" is a name of the column; title - "prevName" is previous a name of the column and "newName" is a new name of the column;
 * 3) for card actions: create, description - "name" is a name of the card; title - "prevName" and "newName" are card names; moved - "cardName" is a card name, "prevName" is the source column's name, "newName" is the target column's name; addComment - "comment" comment's body, "name" - card name;
 * @param {string} source where action accured: board, column, card
 * @param {Object} action action with type of activity and its data
 * @param {string} action.type type of action
 * @param {Object} action.data data to make a message
 * @param {string} action.data.boardId board id where activity occured
 * @param {string} action.data.sourceId board id where activity occured
 * @param {string} action.data.authorId author id
 * @param {string} action.data.date activity date in UTC
 * @return {Object} object that contains activity, updatedBoard and error objects. In case error occured activity and updatedBoard equals null, otherwise error equals null
 */
const addActivity = async (source, action) => {
  try {
    const { authorId, date, boardId, sourceId, ...actionData } = action.data;

    const author = await User.findById(authorId).catch((err) => {
      console.log('Could not find the user who made activity', err);
      return Promise.reject(new Error('Could not find the user who made activity'));
    });

    const activityData = {
      authorId: author._id,
      sourceId,
      sourceType: source,
      messageType: action.type,
      actionData,
      date,
    };

    const activity = await new Activity(activityData)
      .save()
      .catch((err) => {
        console.log('Error in saving activity', err);
        return Promise.reject(new Error('Could not save an activity'));
      });

    const board = await Board.findById(boardId);
    board.addActivity({
      ...activityData,
      _id: activity._id,
    });

    const savedBoard = await board
      .save()
      .catch((err) => {
        console.log('Error on saving board after activity was added', err);
        return Promise.reject(new Error('Could not save a board after activity was added'));
      });

    return { activity, updatedBoard: savedBoard, error: null };
  } catch (error) {
    return { activity: null, updatedBoard: null, error };
  }
};

module.exports = addActivity;
