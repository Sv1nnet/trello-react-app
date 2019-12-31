/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');
const { ColumnSchema } = require('./Column');
const { CardSchema } = require('./Card');
const { HistorySchema } = require('./History');
const { MarkSchema } = require('./Mark');

const { Schema } = mongoose;

const BoardSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  history: [HistorySchema],
  description: {
    type: String,
  },
  isPrivate: {
    type: Boolean,
    required: true,
  },
  cards: [CardSchema],
  marks: [MarkSchema],
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

BoardSchema.methods.addMember = function addMember(memberId) {
  const board = this;
  board.members.push(memberId);
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
  // const columnToUpdate = board.columns.find(column => column._id.toHexString() === columnId);
  // columnToUpdate.update(dataToUpdate);
};

BoardSchema.methods.deleteColumn = function deleteColumn(columnId) {
  const board = this;

  board.columns.id(columnId).remove();
  board.columns = board.columns.sort((columnOne, columnTwo) => {
    if (columnOne.position < columnTwo.position) return -1;
    if (columnOne.position > columnTwo.position) return 1;
    return 0;
  }).map((column, i) => { column.position = i; return column; });

  board.cards.forEach((card, i) => {
    if (card.column.toHexString() === columnId) {
      board.cards.id(card._id.toHexString()).remove();
    }
  });

  board.cards = board.cards.filter(card => card.column.toHexString() !== columnId);
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

BoardSchema.methods.deleteCard = function deleteCard(cardId) {
  const board = this;
  const cardToDelete = board.cards.id(cardId);
  if (!cardToDelete) return;

  cardToDelete.remove();

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
  console.log('new cards', board.cards)
};

const Board = mongoose.model('boards', BoardSchema);

module.exports = {
  Board,
};
