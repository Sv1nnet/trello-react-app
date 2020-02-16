const resolve = require('path').resolve;

const findCardWorker = (req, res) => {
  console.log('request for  card worker')
  res.header('Cache-Control', 'max-age=5').sendFile('/Users/sv1nnet/Documents/Code/GitHub/trello-react-app/server/utils/findCardWorker.js');
};

module.exports = findCardWorker;
