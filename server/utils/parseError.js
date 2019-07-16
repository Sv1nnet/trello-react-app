const _ = require('lodash');

const parseError = (errors) => {
  const result = {};
  _.forEach(errors, (val, key) => {
    result[key] = val.message;
  });
  return result;
};

module.exports = {
  parseError,
};
