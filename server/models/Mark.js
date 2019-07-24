const mongoose = require('mongoose');

const { Schema } = mongoose;

const MarkSchema = new Schema({
  color: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
});

const Mark = mongoose.model('marks', MarkSchema);

module.exports = {
  MarkSchema,
  Mark,
};
