const { resolve } = require('path');

const findCardWorker = (req, res) => {
  const maxAge = 86400; // 86400 is one day
  res.header('Cache-Control', `max-age=${maxAge}`).sendFile(resolve(`.${req.originalUrl}`));
};

module.exports = findCardWorker;
