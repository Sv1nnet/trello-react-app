const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { Board } = require('../../models/Board');
const { User } = require('../../models/User');

const removeBoard = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.status(400).send({ err: 'Invalid token' });
    } else {
      try {
        const user = await User.findById({ _id: decoded._id });
        const board = await Board.findById(boardId);

        if (user && board) {
          user.boards.id(boardId).remove();
          board.members.id(user._id).remove();

          const updatedUser = await user.save();
          const updatedBoard = await board.save();

          const activities = await updatedBoard.getActivities();

          res.status(200).send({
            userData: _.pick(updatedUser, ['email', 'nickname', 'firstName', 'lastName', 'boards']),
            board: { ...updatedBoard._doc, activities },
          });
        } else {
          throw new Error(`Could not find the user with id "${decoded._id}", board with id "${boardId}"`);
        }
      } catch (e) {
        res.status(400).json({ err: 'Could not remove the baord' });
      }
    }
  });
};

module.exports = removeBoard;
