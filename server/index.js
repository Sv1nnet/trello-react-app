require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
console.log('env *********', env);
console.log(process.env.MONGODB_URI_PROD)

if (env === 'development') {
  process.env.PORT = 3111;
  process.env.MONGODB_URI = process.env.MONGODB_URI_DEV;
} else if (env === 'test') {
  process.env.PORT = 3111;
  process.env.MONGODB_URI = process.env.MONGODB_URI_TEST;
} else if (env === 'prod') {
  process.env.PORT = 3111;
  process.env.MONGODB_URI = process.env.MONGODB_URI_PROD;
}

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

require('./db/mongoose');
const { userRouter } = require('./routes/user');
const { boardRouter } = require('./routes/board');
const { utilsRouter } = require('./routes/utils');

const backServer = express();
const port = env !== 'development' && env !== 'test' ? process.env.BACK_PORT : process.env.PORT;
const accessControll = env !== 'development' && env !== 'test' ? '*' : process.env.ADDRESS;

backServer.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', accessControll); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

backServer.use(bodyParser.json());
backServer.use(bodyParser.urlencoded({ extended: true }));

backServer.use((req, res, next) => {
  if (req.method !== 'OPTIONS') console.log('Incoming request', req.method, req.url);
  next();
});

backServer.use('/user', userRouter);
backServer.use('/board', boardRouter);
backServer.use('/utils', utilsRouter);

backServer.listen(port, () => {
  console.log(`Started on port ${port}`);
});

const frontServer = express();

if (env === 'prod') {
  frontServer.use(express.static(path.resolve(__dirname, '../build')));
  frontServer.use('*', express.static(path.resolve(__dirname, '../build')));
  
  frontServer.listen(process.env.FRONT_PORT, () => {
    console.log(`Listening ${process.env.FRONT_PORT} port for serving client build`);
  });
}

module.exports = {
  backServer,
  frontServer,
};
