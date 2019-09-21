const mongoose = require('mongoose');
const { MarkSchema } = require('./Mark');
const { CardCommentSchema } = require('./CardComment');

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
  marks: [MarkSchema],
  description: {
    type: String,
  },
  comments: [CardCommentSchema],
});

const Card = mongoose.model('cards', CardSchema);

module.exports = {
  CardSchema,
  Card,
};
