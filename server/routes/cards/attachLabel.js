const jwt = require('jsonwebtoken');

const { Board } = require('../../models/Board');

const attachLabel = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { cardId, labelId } = req.params;
  const { timeOfChange } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    try {
      const board = await Board.findById(boardId)
        .catch((err) => {
          console.log('Could not find a board', err);
          return Promise.reject(new Error('Could not attach a label'));
        });

      const isOwner = decoded._id === board.owner.toHexString();
      const isMember = isOwner || board.members.find(member => member._id.toHexString() === decoded._id);

      if (isOwner || (isMember && !board.isReadOnly)) {
        const cardToUpdate = board.cards.id(cardId);

        cardToUpdate.attachLabel(labelId);

        const updatedBoard = await board.save().catch((err) => {
          console.log('Could not save board with a attached label', err);
          return Promise.reject(new Error('Could not save board with a attached label'));
        });

        const activities = await updatedBoard.getActivities();

        return res.status(200).send({ ...updatedBoard._doc, timeOfLastChange: timeOfChange, activities });
      }

      res.status(400).send({ err: 'Only board owner can attach label to cards' });
    } catch (e) {
      console.log('Send error response', e);
      res.status(400).send({ err: e.message });
    }
  });
};

module.exports = attachLabel;
