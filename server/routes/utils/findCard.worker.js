const { resolve } = require('path');

const findCardWorker = (req, res) => {
  const maxAge = 1440; // 1440 is one day
  res.header('Cache-Control', `max-age=${maxAge}`).sendFile(resolve(`.${req.originalUrl}`));
};

module.exports = findCardWorker;
