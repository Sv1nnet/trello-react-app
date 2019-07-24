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

const Column = mongoose.model('columns', ColumnSchema);

module.exports = {
  ColumnSchema,
  Column,
};
