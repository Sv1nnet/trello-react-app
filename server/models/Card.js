const mongoose = require('mongoose');

const { Schema } = mongoose;

const CardSchema = new Schema({
  column: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  mark: {
    type: Schema.Types.ObjectId,
  },
});

const Card = mongoose.model('cards', CardSchema);

module.exports = {
  CardSchema,
  Card,
};
