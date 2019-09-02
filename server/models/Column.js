/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const ColumnSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  position: {
    type: Number,
    required: true,
  },
});

ColumnSchema.methods.update = function update(data) {
  const column = this;

  for (const key in data) {
    column[key] = data[key];
  }
};

const Column = mongoose.model('columns', ColumnSchema);

module.exports = {
  ColumnSchema,
  Column,
};
