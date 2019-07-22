const env = process.env.NODE_ENV || 'development';
console.log('env *********', env);

if (env === 'development') {
  process.env.PORT = 3111;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/trello';
} else if (env === 'test') {
  process.env.PORT = 3111;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/trello-test';
}

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const { mongoose } = require('./db/mongoose');
const { userRouter } = require('./routes/user');

const app = express();
const port = process.env.PORT;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log('Incoming requst', req.url);
  next();
});

app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app,
};
