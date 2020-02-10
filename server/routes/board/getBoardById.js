const jwt = require('jsonwebtoken');
const { Board } = require('../../models/Board');

const getBoardById = (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  const boardId = req.params.id;
  Board.findById(boardId)
    .then(async (board) => {
      if (board) {
        if (!board.isPrivate) {
          const activities = await board.getActivities();

          return res.status(200).send({ ...board._doc, activities });
        }

        if (token) {
          jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
              res.status(400).send({ err: 'Invalid token' });
            } else {
              const isMember = !!board.members.find(member => member._id.toString() === decoded._id.toString());

              if (isMember) {
                const activities = await board.getActivities();

                res.status(200).send({ ...board._doc, activities });
              } else {
                res.status(403).send({ err: 'You have no access to this board' });
              }
            }
          });
        } else {
          res.status(403).send({ err: 'You have no access to this board' });
        }
      } else {
        return res.status(400).send({ err: 'Could not find the board' });
      }
    })
    .catch(() => res.status(400).send({ err: 'Could not find the board' }));
};

module.exports = getBoardById;
