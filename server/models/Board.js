/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');
const { ColumnSchema } = require('./Column');
const { CardSchema, Card } = require('./Card');
const { ActivitySchema, Activity } = require('./Activity');
const { LabelSchema, Label } = require('./Label');

const { Schema } = mongoose;


const labelColors = {
  green: 'green',
  red: 'red',
  purple: 'purple',
  skyblue: 'skyblue',
  yellow: 'rgb(242, 214, 0)',
};

const labelColorsArray = [];

for (const color in labelColors) {
  labelColorsArray.push({ colorName: color, color: labelColors[color] });
}


const BoardSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  activities: [ActivitySchema],
  description: {
    type: String,
  },
  isPrivate: {
    type: Boolean,
    required: true,
  },
  cards: [CardSchema],
  labels: {
    type: [LabelSchema],
    default: labelColorsArray.map(color => new Label({ color: color.color, colorName: color.colorName })),
  },
  chat: {
    type: Schema.Types.ObjectId,
    // required: true,
  },
  members: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      nickname: {
        type: String,
        required: true,
      },
    },
  ],
  isReadOnly: {
    type: Boolean,
    required: true,
  },
  columns: [ColumnSchema],
});


BoardSchema.methods.addMember = function addMember(member) {
  const board = this;
  board.members.push(member);
};

BoardSchema.methods.removeMember = function removeMember(memberId) {
  const board = this;
  board.members = board.members.filter(member => member._id.toHexString() !== memberId);
};

BoardSchema.methods.setName = function setName(name) {
  const board = this;
  board.name = name;
};

BoardSchema.methods.updateBoard = function updateBoard(updateData) {
  const board = this;
  for (const prop in updateData) {
    board[prop] = updateData[prop];
  }
};

BoardSchema.methods.addColumn = function addColumn(column) {
  const board = this;
  board.columns.push(column);
};

BoardSchema.methods.updateColumn = async function addColumn(columnId, dataToUpdate) {
  const board = this;
  const columnToUpdate = board.columns.id(columnId);

  columnToUpdate.update(dataToUpdate);
};

BoardSchema.methods.deleteColumn = async function deleteColumn(columnId) {
  const board = this;

  const columnToDelete = board.columns.id(columnId);
  columnToDelete.remove();

  board.columns = board.columns.sort((columnOne, columnTwo) => {
    if (columnOne.position < columnTwo.position) return -1;
    if (columnOne.position > columnTwo.position) return 1;
    return 0;
  }).map((column, i) => { column.position = i; return column; });

  // Delete cards and activities associated with them that were in deleted column
  board.cards.forEach(async (card, i) => {
    if (card.column.toHexString() === columnId) {
      await board.removeActivities(card._id.toHexString());
      card.remove();
      await Card.findByIdAndDelete(card._id.toHexString());
    }
  });

  await board.removeActivities(columnToDelete._id.toHexString());
};

BoardSchema.methods.addCard = function addCard(card) {
  const board = this;
  board.cards.push(card);
};

BoardSchema.methods.updateCard = function updateCard(cardId, dataToUpdate) {
  const board = this;
  const cardToUpdate = board.cards.find(card => card._id.toHexString() === cardId);

  if (cardToUpdate) cardToUpdate.update(dataToUpdate);
};

BoardSchema.methods.deleteCard = async function deleteCard(cardId) {
  const board = this;
  const cardToDelete = board.cards.id(cardId);
  if (!cardToDelete) return;

  cardToDelete.remove();

  cardToDelete.comments.forEach(async (comment) => {
    await board.removeActivities(comment._id.toHexString());
  });

  const columns = {};
  const newCards = [];

  board.columns.forEach((column) => {
    const columnId = column._id.toHexString();
    columns[columnId] = board.cards
      .filter(card => card.column._id.toHexString() === columnId)
      .sort((cardOne, cardTwo) => {
        if (cardOne.position > cardTwo.position) return 1;
        if (cardOne.position < cardTwo.position) return -1;
        return 0;
      });

    columns[columnId].forEach((card, i) => {
      card.position = i;
      card.update({ position: i });
    });
  });

  for (const column in columns) {
    columns[column].forEach((card) => { newCards.push(card); });
  }

  board.cards = newCards;
  await board.removeActivities(cardToDelete._id.toHexString());
};

BoardSchema.methods.addActivity = async function addActivity(activity) {
  const board = this;
  board.activities.push(activity);
};

BoardSchema.methods.removeActivities = async function removeActivities(sourceId) {
  const board = this;
  try {
    const newActivities = board.activities.filter(activity => activity.sourceId.toHexString() !== sourceId);
    board.activities = newActivities;

    const activitiesToDelete = await Activity.find({ sourceId });
    activitiesToDelete.forEach(act => act.remove());
  } catch (error) {
    console.log('Error in deleting activities', error);
    Promise.reject(new Error('Error in deleting activities'));
  }
};

/**
 * @param {number} number number of activities to get
 * @param {number} start position in array starting from which we want to get activities
 * @return {Array} array of activities
 */
BoardSchema.methods.getActivities = async function getActivities(start = 0, number = 10) {
  const board = this;
  number = +number || 10;
  start = +start || 0;

  try {
    return await Promise.all(board.activities
      .reverse()
      .slice(0, start + number)
      .map(async act => ({
        _id: act._id.toHexString(),
        author: await act.getAuthorName(),
        message: await act.getMessage(),
        date: act.date,
      })));
  } catch (error) {
    console.log('Could not get number of activities', error);
    return Promise.reject(error);
  }
};

BoardSchema.methods.getAllActivities = async function getAllActivities() {
  const board = this;
  try {
    return await Promise.all(board.activities
      .reverse()
      .map(async act => ({
        _id: act._id.toHexString(),
        author: await act.getAuthorName(),
        message: await act.getMessage(),
        date: act.date,
      })));
  } catch (error) {
    console.log('Could not get all activities', error);
    return Promise.reject(error);
  }
};

BoardSchema.methods.updateLabel = function updateLabel(labelId, data) {
  const board = this;

  board.labels.id(labelId).update(data);
};

const Board = mongoose.model('boards', BoardSchema);

module.exports = {
  Board,
  BoardSchema,
};
