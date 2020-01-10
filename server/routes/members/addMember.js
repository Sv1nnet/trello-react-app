const jwt = require('jsonwebtoken');
const { Board } = require('../../models/Board');
const { User } = require('../../models/User');

const addMember = (req, res) => {
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

        if (!board.members.find(boardMember => boardMember._id.toHexString() === member)) {

          board.addMember({ _id: user._id, email: user.email, nickname: user.nickname });
          user.addBoard({ _id: board.id, title: board.title });

          const savedBoard = await board.save();
          const savedUser = await user.save();

          const activities = await board.getActivities();
console.log(activities)
          return res.status(200).send({ message: 'Member added', board: { ...savedBoard._doc, activities } });
        }
        return res.status(200).send({ message: 'Member already added', board });
      }

      res.status(400).send({ err: 'Only board owner can add members' });
    } catch (e) {
      res.status(400).send({ err: 'Could not add a member' });
    }
  });
};

module.exports = addMember;
