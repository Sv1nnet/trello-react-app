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
  const columnToUpdate = board.columns.find(column => column._id.toHexString() === columnId);
  columnToUpdate.update(dataToUpdate);
};

BoardSchema.methods.deleteColumn = function deleteColumn(columnId) {
  const board = this;
  board.columns = board.columns.filter(column => column._id.toHexString() !== columnId);
};

const Board = mongoose.model('boards', BoardSchema);

module.exports = {
  Board,
};
