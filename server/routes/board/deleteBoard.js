const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { Board } = require('../../models/Board');
const { User } = require('../../models/User');

const deleteBoard = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.status(400).send({ err: 'Invalid token' });
    } else {
      try {
        const user = await User.findById({ _id: decoded._id });
        const board = await Board.findById(boardId);
        const { members } = board;

        if (user && board && user._id.toHexString() === board.owner.toHexString()) {
          await Promise.all(members.map(async (boardMember) => {
            const member = await User.findById(boardMember._id);

            member.boards.id(boardId).remove();
            await member.save();
          }));

          board.remove();

          const updatedUser = await User.findById({ _id: decoded._id });

          res.status(200).send(_.pick(updatedUser, ['email', 'nickname', 'firstName', 'lastName', 'boards']));
        } else {
          throw new Error(`Could not find the user with id "${decoded._id}", board with id "${boardId}" or user is not the board owner`);
        }
      } catch (e) {
        console.log(e);
        res.status(400).json({ err: 'Could not delete the baord' });
      }
    }
  });
};

module.exports = deleteBoard;
