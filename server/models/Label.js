const mongoose = require('mongoose');

const { Schema } = mongoose;

const LabelSchema = new Schema({
  color: {
    type: String,
    required: true,
  },
  colorName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
});

LabelSchema.methods.update = function update(data) {
  const label = this;

  for (const key in data) {
    label[key] = data[key];
  }
};

const Label = mongoose.model('labels', LabelSchema);

module.exports = {
  LabelSchema,
  Label,
};
