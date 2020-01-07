const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { Board } = require('../../models/Board');
const { Column } = require('../../models/Column');


const createColumn = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { column } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    try {
      const board = await Board.findById(boardId)
        .catch((err) => {
          console.log('Could not find a board', err);
          return Promise.reject(new Error('Could not create a column'));
        });

      const isOwner = decoded._id === board.owner.toHexString();
      const isMember = isOwner || board.members.find(member => member._id.toHexString() === decoded._id);

      if (isOwner || (isMember && !board.isReadOnly)) {
        const newColumn = await new Column({ ...column }).save().catch((err) => {
          console.log('Could not save column', err);
          return Promise.reject(new Error('Could not create a new column'));
        });
        board.addColumn(newColumn);

        await board.save().catch((err) => {
          console.log('Could not save board with a new column', err);
          return Promise.reject(new Error('Could not save the board with a new column'));
        });

        return res.status(200).send({ column: _.pick(newColumn, ['_id', 'title', 'position']) });
      }

      res.status(400).send({ err: 'Only board owner can add new columns' });
    } catch (e) {
      console.log('Send error response', e);
      res.status(400).send({ err: e.message });
    }
  });
};

module.exports = createColumn;
