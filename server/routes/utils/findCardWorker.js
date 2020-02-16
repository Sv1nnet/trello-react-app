const { resolve } = require('path');

const findCardWorker = (req, res) => {
  res.header('Cache-Control', 'max-age=5').sendFile(resolve(`.${req.originalUrl}`));
};

module.exports = findCardWorker;
