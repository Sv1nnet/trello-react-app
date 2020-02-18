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

        if (user && board && user._id.toHexString() === board.owner.toHexString()) {
          user.boards.id(boardId).remove();
          board.remove();

          const updatedUser = await user.save();

          res.status(200).send(_.pick(updatedUser, ['email', 'nickname', 'firstName', 'lastName', 'boards']));
        } else {
          res.status(400).json({ err: 'Could not delete board board' });
        }
      } catch (e) {
        res.status(400).json({ err: 'Could not delete the baord' });
      }
    }
  });
};

module.exports = deleteBoard;
