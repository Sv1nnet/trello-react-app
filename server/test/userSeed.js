/* eslint-disable no-underscore-dangle */
const { ObjectID } = require('mongodb');
const { User } = require('../models/User');
const { sendConfirmationEmail } = require('../mailer');

function initNewUser(user, shouldSendEmail) {
  user.hashPassword(user.password);
  user.generateConfirmationToken();
  user.generateAuthObject();
  if (shouldSendEmail) sendConfirmationEmail(user);
}

const userOne = new User({
  _id: new ObjectID(),
  email: 'svi_1@mail.ru',
  password: '12345678',
  nickname: 'nick_1',
  tokens: [],
  boards: [{
    id: new ObjectID().toHexString(),
    title: 'User one board',
  }],
});
initNewUser(userOne, false);

const userTwo = new User({
  _id: new ObjectID(),
  email: 'svi_2@mail.ru',
  password: '12345678',
  nickname: 'nick_2',
  tokens: [],
  boards: [{
    id: new ObjectID().toHexString(),
    title: 'User two board',
  }],
});
initNewUser(userTwo, false);

const users = [userOne, userTwo];

const populateUsers = function populateUsers(done) {
  this.timeout(10000);
  User.deleteMany({}).then(() => {
    User.insertMany(users)
      .then(() => {
        done();
      })
      .catch(err => done(err));
  });
};

module.exports = {
  users,
  populateUsers,
  initNewUser,
};
