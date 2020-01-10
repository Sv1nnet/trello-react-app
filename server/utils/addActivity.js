/* eslint-disable object-curly-newline */
const { Activity } = require('../models/Activity');
const { User } = require('../models/User');
const { Board } = require('../models/Board');

/**
 * These are data you need to pass with data in action:
 * 1) for board actions: addMember, removeMember - "name" is a name of the member; rename - "name" is a new name of the board;
 * 2) for column actions: create, delete - "name" is a name of the column; rename - "prevName" is previous a name of the column and "newName" is a new name of the column;
 * 3) for card actions: create, delete, description - "name" is a name of the card; rename - "prevName" and "newName" are card names; moved - "cardName" is a card name, "prevName" is the source column's name, "newName" is the target column's name; addComment - "comment" comment's body, "name" - card name;
 * @param {string} source where action accured: board, column, card
 * @param {Object} action action with type of activity and its data
 * @param {string} action.author author's name
 * @param {string} action.date activity date in UTC format
 * @param {string} action.boardId board id where activity occured
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

const removeActivity = async (board, sourceId) => {
  const newActivities = board.activities.filter(activity => activity.sourceId.toHexString() !== cardToDelete._id.toHexString());
  board.activities = newActivities;

  const activitiesToDelete = await Activity.find({ sourceId });
  activitiesToDelete.forEach(act => act.remove());
};

module.exports = addActivity;
