const mongoose = require('mongoose');

const { Schema } = mongoose;

const CardCommentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
});

const CardComment = mongoose.model('cardComment', CardCommentSchema);

module.exports = {
  CardCommentSchema,
  CardComment,
};
