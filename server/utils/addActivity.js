/* eslint-disable object-curly-newline */
const { Activity } = require('../models/Activity');
const { User } = require('../models/User');
const { Board } = require('../models/Board');

const getBoardMessage = (author, action) => {
  switch (action.type) {
    case 'create':
      return `${author} created the board`;
    case 'description':
      return `${author} updated a board description`;
    case 'addMember':
      return `${author} added a ${action.data.name} to board members`;
    case 'removeMember':
      return `${author} removed a ${action.data.name} from board members`;
    case 'rename':
      return `${author} renamed the board as ${action.data.name}`;
    case 'setReadonly':
      return `${author} set the board Readonly`;
    case 'setEditable':
      return `${author} set the board Editable`;
    case 'setPrivate':
      return `${author} set the board Private`;
    case 'setPublic':
      return `${author} set the board Public`;
    default:
      return null;
  }
};

const getColumnMessage = (author, action) => {
  switch (action.type) {
    case 'create':
      return `${author} created the column ${action.data.name}`;
    case 'delete':
      return `${author} deleted the column ${action.data.name}`;
    case 'rename':
      return `${author} renamed the column ${action.data.prevName} as ${action.data.newName}`;
    default:
      return null;
  }
};

const getCardMessage = (author, action) => {
  switch (action.type) {
    case 'create':
      return `${author} created the card ${action.data.name}`;
    case 'delete':
      return `${author} deleted the card ${action.data.name}`;
    case 'rename':
      return `${author} renamed the card ${action.data.prevName} as ${action.data.newName}`;
    case 'moved':
      return `${author} moved the card ${action.data.cardName} from ${action.data.prevName} column to ${action.data.newName} one`;
    case 'desciption':
      return `${author} updated a description for the card ${action.data.name}`;
    case 'addComment':
      return `${author} added a comment ${action.data.comment} for the card ${action.data.name}`;
    default:
      return null;
  }
};

const messages = {
  board: getBoardMessage,
  columns: getColumnMessage,
  card: getCardMessage,
};

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
    const { authorId, date, boardId, ...actionData } = action.data;

    const author = await User.findById(authorId).catch((err) => {
      console.log('Could not find the user who made activity', err);
      return Promise.reject(new Error('Could not find the user who made activity'));
    });

    const activityData = {
      authorId: author._id,
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

const removeActivity = async (boardId, activityId) => {

};

module.exports = addActivity;
