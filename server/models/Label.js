const mongoose = require('mongoose');

const { Schema } = mongoose;

const LabelSchema = new Schema({
  color: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
});

const Label = mongoose.model('labels', LabelSchema);

module.exports = {
  LabelSchema,
  Label,
};
