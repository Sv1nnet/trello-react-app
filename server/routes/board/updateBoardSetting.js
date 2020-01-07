const jwt = require('jsonwebtoken');
const { Board } = require('../../models/Board');
const { User } = require('../../models/User');

const updateBoardSetting = (req, res) => {
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
};

module.exports = updateBoardSetting;
