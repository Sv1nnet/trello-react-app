/* eslint-disable no-underscore-dangle */
const express = require('express');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { Board } = require('../models/Board');
const { User } = require('../models/User');
const { parseError } = require('../utils/parseError');

const router = express.Router();

router.get('/all', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(400).send({ err: 'Invalid token' });
    } else {
      User.findById({ _id: decoded._id })
        .then((user) => {
          const { boards } = user;
          res.status(200).send({ boards });
        })
        .catch((err) => {
          console.log('Error findig user', err);
          res.status(400).send({ err });
        });
    }
  });
});

router.get('/:id', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  console.log(req.query);
  // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //   if (err) {
  //     res.status(400).send({ err: 'Invalid token' });
  //   } else {
  //     User.findById({ _id: decoded._id })
  //       .then((user) => {
  //         const { boards } = user;
  //         res.status(200).send({ boards });
  //       })
  //       .catch((err) => {
  //         console.log('Error findig user', err);
  //         res.status(400).send({ err });
  //       });
  //   }
  // });
});

router.post('/', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  console.log('post on /board/');
  console.log('req.body', req.body);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(400).send({ err: 'Invalid token' });
    } else {
      User.findById({ _id: decoded._id })
        .then((user) => {
          if (user) {
            const board = new Board({
              owner: user._id,
              title: req.body.title,
              members: [user._id],
              description: req.body.description,
              isPrivate: req.body.access === 'private',
              isReadOnly: true,
            });

            board.save()
              .then((board) => {
                user.boards.push({
                  id: board._id,
                  title: board.title,
                  description: board.description,
                });
                return user.save().catch(err => console.log('Error saving user with new board', err));
              })
              .then(doc => res.status(200).send({
                id: board._id,
                title: board.title,
                owner: user.nickname,
                description: board.description,
                isPrivate: board.isPrivate,
                marks: board.marks,
                boards: user.boards,
              }));
          } else {
            res.status(400).json({ err: 'Could not find the user' });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ err })
        });
    }
  });
});

module.exports = {
  boardRouter: router,
};
