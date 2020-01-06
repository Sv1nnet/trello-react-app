const mongoose = require('mongoose');

const { Schema } = mongoose;

const ActivitySchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Activity = mongoose.model('activities', ActivitySchema);

module.exports = {
  ActivitySchema,
  Activity,
};