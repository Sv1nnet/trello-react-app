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
      id: {
        type: Schema.Types.ObjectId,
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
  board.members = board.members.filter(member => member === memberId);
};

BoardSchema.methods.setName = function setName(name) {
  const board = this;
  board.name = name;
};

BoardSchema.methods.switchReadOnly = function switchReadOnly(readOnly) {
  const board = this;
  board.readOnly = readOnly;
};

BoardSchema.methods.addColumn = function addColumn(columnId) {
  const board = this;
  board.columns.push(columnId);
};

BoardSchema.methods.removeColumn = function removeColumn(columnId) {
  const board = this;
  board.columns = board.columns.filter(column => column === columnId);
};

const Board = mongoose.model('boards', BoardSchema);

module.exports = {
  Board,
};
