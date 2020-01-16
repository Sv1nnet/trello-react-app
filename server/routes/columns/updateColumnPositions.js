const jwt = require('jsonwebtoken');
const { Board } = require('../../models/Board');

const updateColumnPositions = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { columns, timeOfChange } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    try {
      const board = await Board.findById(boardId)
        .catch((err) => {
          console.log('Could not find a board', err);
          return Promise.reject(new Error('Could not change column positions'));
        });

      const isOwner = decoded._id === board.owner.toHexString();
      const isMember = isOwner || board.members.find(member => member._id.toHexString() === decoded._id);

      if (isOwner || (isMember && !board.isReadOnly)) {
        columns.forEach((column) => {
          const dataToUpdate = {
            position: column.position,
          };

          board.updateColumn(column._id, dataToUpdate);
        });

        const savedBoard = await board.save().catch((err) => {
          console.log('Could not save board with a new column positions', err);
          return Promise.reject(new Error('Could not save the board with a new column positions'));
        });
        const activities = await savedBoard.getActivities();

        return res.status(200).send({ ...savedBoard._doc, timeOfLastChange: timeOfChange, activities });
      }

      res.status(400).send({ err: 'Only board owner can change column positions' });
    } catch (e) {
      console.log('Send error response', e);
      res.status(400).send({ err: e.message });
    }
  });
};

module.exports = updateColumnPositions;
