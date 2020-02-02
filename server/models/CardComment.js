const mongoose = require('mongoose');

const { Schema } = mongoose;

const CardCommentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
});

CardCommentSchema.methods.update = function update(data) {
  const comment = this;

  for (const key in data) {
    comment[key] = data[key];
  }
  comment.edited = true;
};

const CardComment = mongoose.model('cardComment', CardCommentSchema);

module.exports = {
  CardCommentSchema,
  CardComment,
};
