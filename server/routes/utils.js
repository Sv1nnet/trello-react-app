const express = require('express');

const router = express.Router();
const findCardWorker = require('./utils/findCard.worker.js');

router.get('/findCardWorker.js', findCardWorker);

module.exports = {
  utilsRouter: router,
};
