/* eslint-disable no-underscore-dangle */
const express = require('express');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { User } = require('../models/User');
const { parseError } = require('../utils/parseError');
const { sendConfirmationEmail } = require('../mailer');

const router = express.Router();

// Change user credentials
router.post('/', (req, res) => {
  if (req.body.tokenAccess !== 'auth') {
    return res.status(400).send({ err: 'Wrong auth token type' });
  }

  const token = req.header('Authorization').split(' ')[1];
  const { credentials } = req.body;

  const { email } = credentials;
  const { password } = credentials;
  const { nick } = credentials;
  const { firstName } = credentials;
  const { lastName } = credentials;

  const userData = {
    email,
    password,
    nick,
    firstName,
    lastName,
  };

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ err: 'Invalid token' });
    } else {
      User.findOneAndUpdate(
        {
          _id: decoded._id,
        },
        {
          $set: userData,
        },
        {
          new: true,
        },
      ).then((user) => {
        res.status(200).header('Authorization', `Bearer ${token}`).send(_.pick(user, ['email', 'nick', 'firstName', 'lastName', 'boards']));
      }).catch(err => res.status(400).send(parseError(err)));
    }
  });
});

// Registration
router.post('/signup', (req, res) => {
  const { credentials } = req.body;
  const { email } = credentials;
  const { password } = credentials;
  const { nick } = credentials;
  const { firstName } = credentials;
  const { lastName } = credentials;

  User.findOne({ email }).then((doc) => {
    if (doc) {
      res.status(400).send({ err: 'User with this email already exists' });
    } else {
      User.findOne({ nick }).then((doc) => {
        if (doc) {
          return Promise.reject(new Error('User with this nick already exists'));
        }

        const user = new User({
          email,
          password,
          nick,
          firstName,
          lastName,
        });

        user.hashPassword(user.password);
        user.generateConfirmationToken();

        user.save()
          .then((doc) => {
            if (!doc) {
              return res.status(400).send({ err: 'Could not create a new user' });
            }
            sendConfirmationEmail(user)
              .then(() => {
                res.status(200).send(_.pick(doc, ['confirmed']));
              })
              .catch((err) => {
                res.status(500).send({ err: 'Could not send confirmation email' });
              });
          })
          .catch(() => {
            res.status(400).send({ err: 'Validation failed' });
          });
      }).catch(() => res.status(400).send({ err: 'User with this nickname already exists' }));
    }
  }).catch(() => res.status(400).send({ err: 'Validation failed' }));
});

// Confirm registration
router.get('/confirmation/:token', (req, res) => {
  const { token } = req.params;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ err: 'Invalid token' });
    } else {
      User.findById({ _id: decoded._id }).then((user) => {
        const confToken = user.tokens.find(userToken => userToken.token === token);

        if (!confToken) return res.status(400).send({ err: 'Confirmation token is not found.' });

        User.findOneAndUpdate(
          {
            _id: user._id,
          },
          {
            $set: {
              confirmed: true,
            },
          },
          {
            new: true,
          },
        ).then((user) => {
          const authToken = user.generateAuthToken().token;
          res.status(200).header('Authorization', `Bearer ${authToken}`).send(_.pick(user, ['email', 'nick', 'firstName', 'lastName', 'boards']));
        }).catch(err => res.status(400).send(parseError(err)));
      });
    }
  });
});

// Login
router.post('/login', (req, res) => {
  const { credentials } = req.body;
  const { email } = credentials;
  const { password } = credentials;
  const queryField = email ? 'email' : 'nick';
  const queryObject = {
    [queryField]: credentials[queryField],
  };

  User.findOne(queryObject).then((user) => {
    if (!user) return Promise.reject(new Error('There is no such user'));

    if (user.isValidPassword(password)) {
      if (user.confirmed) {
        const authObject = user.generateAuthObject();
        const authToken = authObject.token.token;

        res.status(200).header('Authorization', `Bearer ${authToken}`).send(authObject);
      } else {
        res.status(200).send({ confirmed: false });
      }
    } else {
      res.status(400).send({ err: 'Password is wrong' });
    }
  }).catch(err => res.status(400).send({ err: err.message }));
});

// Logout
router.post('/logout', (req, res) => {
  const token = req.header('Authorization').split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ err: 'Invalid token' });

    // Delete auth token from user.tokens that we got from current client session
    User.findByIdAndUpdate(
      decoded._id,
      {
        $pull: {
          tokens: {
            access: 'auth',
            token,
          },
        },
      },
      {
        new: true,
      },
    )
      .then((user) => {
        res.status(200).send();
      })
      .catch((err) => {
        res.status(500).send({ err: 'Could not delete auth token' });
      });
  });
});

module.exports = {
  userRouter: router,
};
