/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');
const { LabelSchema } = require('./Label');
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
  labels: [LabelSchema],
  description: {
    type: String,
    default: '',
  },
  comments: [CardCommentSchema],
});

CardSchema.methods.update = function update(data) {
  const card = this;

  for (const key in data) {
    card[key] = data[key];
  }
};

CardSchema.methods.addComment = function addComment(comment) {
  const card = this;

  card.comments.push(comment);
};

CardSchema.methods.deleteComment = function deleteComment(commentId) {
  const card = this;

  card.comments.id(commentId).remove();
};

const Card = mongoose.model('cards', CardSchema);

module.exports = {
  CardSchema,
  Card,
};
