const express = require('express');

const router = express.Router();
const findCardWorker = require('./utils/findCardWorker');

router.get('/findCardWorker.js', findCardWorker);

module.exports = {
  utilsRouter: router,
};
