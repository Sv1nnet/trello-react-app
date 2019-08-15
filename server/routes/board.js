/* eslint-disable no-underscore-dangle */
const express = require('express');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose');
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
          // console.log('boards request', boards);
          res.status(200).send({ boards });
        })
        .catch((err) => {
          console.log('Error finding user', err);
          res.status(400).send({ err });
        });
    }
  });
});

router.get('/:id', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  const boardId = req.params.id;
  Board.findById(boardId)
    .then((board) => {
      if (board) {
        if (!board.isPrivate) {
          return res.status(200).send(board);
        }

        if (token) {
          jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
              res.status(400).send({ err: 'Invalid token' });
            } else {
              const isMember = !!board.members.find(member => member._id.toString() === decoded._id.toString());

              if (isMember) {
                res.status(200).send(board);
              } else {
                res.status(403).send({ err: 'You have no access to this board' });
              }
            }
          });
        } else {
          res.status(403).send({ err: 'You have no access to this board' });
        }
      } else {
        res.status(400).send({ err: 'Could not find the board' });
      }
    })
    .catch(() => res.status(400).send({ err: 'Could not find the board' }));
});

router.post('/:id', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      req.status(400).send({ err: 'Invalid token' });
    } else {
      const board = await Board.findById(boardId);

      if (board) {
        const isOwner = board.owner.toHexString() === decoded._id;

        if (!isOwner) {
          res.status(400).send({ err: 'Only board owner can change board settings and title ' });
        } else {
          try {
            board.updateBoard(req.body);
            const updatedBoard = await board.save();

            if (req.body.title) {
              const usersToUpdate = await Promise.all(updatedBoard.members.map(async (member) => {
                const result = await User.findById(member._id.toHexString());
                return result;
              }));

              const udpatedUsers = usersToUpdate.map((user) => {
                user.updateBoardTitle(updatedBoard);
                return user.save();
              });

              await Promise.all(udpatedUsers);
            }
            res.status(200).send(updatedBoard);
          } catch (e) {
            console.log(e);
            res.status(400).send({ err: 'Could not update board in updating' });
          }
        }
      } else {
        res.status(400).send({ err: 'Could not find the board' });
      }
    }
  });
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
              members: [
                {
                  _id: user._id,
                  email: user.email,
                  nickname: user.nickname,
                },
              ],
              description: req.body.description,
              isPrivate: req.body.access === 'private',
              isReadOnly: true,
            });

            board.save()
              .then((board) => {
                user.boards.push({
                  _id: board._id,
                  title: board.title,
                });
                return user.save().catch(err => console.log('Error saving user with new board', err));
              })
              .then(doc => res.status(200).send({
                _id: board._id,
                title: board.title,
                owner: user.nickname,
                description: board.description,
                members: [{
                  _id: user._id,
                  email: user.email,
                  nickname: user.nickname,
                }],
                isPrivate: board.isPrivate,
                isReadOnly: board.isReadOnly,
                marks: board.marks,
                boards: board.boards,
                columns: board.columns,
              }));
          } else {
            res.status(400).json({ err: 'Could not find the user' });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ err });
        });
    }
  });
});

module.exports = {
  boardRouter: router,
};
