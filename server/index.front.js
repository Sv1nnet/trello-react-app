const path = require('path');
const express = require('express');

require('dotenv').config();

const frontServer = express();

frontServer.use(express.static(path.resolve(__dirname, '../build')));
frontServer.use('*', express.static(path.resolve(__dirname, '../build')));

frontServer.listen(process.env.FRONT_PORT, () => {
  console.log(`Listening ${process.env.FRONT_PORT} port for serving client build`);
});
