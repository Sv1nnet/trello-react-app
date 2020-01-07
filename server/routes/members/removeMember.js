const jwt = require('jsonwebtoken');
const { Board } = require('../../models/Board');
const { User } = require('../../models/User');

const removeMember = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { member } = req.body;
  const boardId = req.params.id;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    try {
      const board = await Board.findById(boardId);

      const isOwner = board.owner.toHexString() === decoded._id;

      if (isOwner || decoded._id === member) {
        const user = await User.findById(member);

        if (!board.members.find(boardMember => boardMember._id === member)) {

          board.removeMember(user._id.toHexString());
          user.removeBoard({ _id: board.id });

          const savedBoard = await board.save();

          const savedUser = await user.save();

          return res.status(200).send({ message: 'Member removed', board: savedBoard });
        }
        return res.status(200).send({ message: 'Member already removed', board });
      }

      res.status(400).send({ err: 'Only board owner can remove members' });
    } catch (e) {
      res.status(400).send({ err: 'Could not remove a member' });
    }
  });
};

module.exports = removeMember;