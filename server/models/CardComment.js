const mongoose = require('mongoose');

const { Schema } = mongoose;

const CardCommentSchema = new Schema({
  text: {
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

CardCommentSchema.methods.update = function update(data) {
  const comment = this;

  for (const key in data) {
    comment[key] = data[key];
  }
};

const CardComment = mongoose.model('cardComment', CardCommentSchema);

module.exports = {
  CardCommentSchema,
  CardComment,
};
