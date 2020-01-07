const jwt = require('jsonwebtoken');
const { Board } = require('../../models/Board');

const getBoardMembers = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    Board.findById(boardId)
      .then((board) => {
        if (board) {
          return res.status(200).send({ members: board.members });
        }

        res.status(400).send({ err: 'Board is not found' });
      })
      .catch((err) => {
        console.log('Could not find a board', err);
        res.status(400).send({ err: 'Could not find a board' });
      });
  });
};

module.exports = getBoardMembers;
