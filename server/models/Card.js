/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');
const { LabelSchema } = require('./Label');
const { Board } = require('./Board');
const { CardCommentSchema, CardComment } = require('./CardComment');

const { Schema, Types } = mongoose;

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
  labels: [Schema.Types.ObjectId],
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
  const newComment = new CardComment({
    ...comment,
    authorId: mongoose.Types.ObjectId(comment.authorId),
  });

  card.comments.unshift(newComment);

  return newComment;
};

CardSchema.methods.updateComment = function addComment({ commentId, text }) {
  const card = this;
  const commentToUpdated = card.comments.id(commentId);

  commentToUpdated.update({ text });

  return commentToUpdated;
};

CardSchema.methods.deleteComment = function deleteComment(commentId) {
  const card = this;

  card.comments.id(commentId).remove();
};

CardSchema.methods.attachLabel = function attachLabel(labelId) {
  const card = this;

  if (!card.labels.find(label => label._id.toHexString() === labelId)) card.labels.push(new Types.ObjectId(labelId));
};

CardSchema.methods.removeLabel = function removeLabel(labelId) {
  const card = this;

  card.labels = card.labels.filter(label => label._id.toHexString() !== labelId);
};

const Card = mongoose.model('cards', CardSchema);

module.exports = {
  CardSchema,
  Card,
};
