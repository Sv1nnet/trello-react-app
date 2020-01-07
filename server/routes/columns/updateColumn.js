const jwt = require('jsonwebtoken');
const { Board } = require('../../models/Board');

const updateColumn = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { columnId } = req.params;
  const { dataToUpdate } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    try {
      const board = await Board.findById(boardId)
        .catch((err) => {
          console.log('Could not find a board', err);
          return Promise.reject(new Error('Could not delete a column'));
        });

      const isOwner = decoded._id === board.owner.toHexString();
      const isMember = isOwner || board.members.find(member => member._id.toHexString() === decoded._id);

      if (isOwner || (isMember && !board.isReadOnly)) {
        board.updateColumn(columnId, dataToUpdate);

        const savedBoard = await board.save().catch((err) => {
          console.log('Could not save board with a new column', err);
          return Promise.reject(new Error('Could not save the board with a new column'));
        });

        return res.status(200).send(savedBoard);
      }

      res.status(400).send({ err: 'Only board owner can remove new columns' });
    } catch (e) {
      console.log('Send error response', e);
      res.status(400).send({ err: e.message });
    }
  });
};

module.exports = updateColumn;