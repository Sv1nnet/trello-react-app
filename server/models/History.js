const mongoose = require('mongoose');

const { Schema } = mongoose;

const HistorySchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const History = mongoose.model('histories', HistorySchema);

module.exports = {
  HistorySchema,
  History,
};
