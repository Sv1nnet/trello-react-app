/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');

const { Board } = require('../../models/Board');

const updateCardPositions = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { cards, timeOfChange } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    try {
      const board = await Board.findById(boardId)
        .catch((err) => {
          console.log('Could not find a board', err);
          return Promise.reject(new Error('Could not change card positions'));
        });

      const isOwner = decoded._id === board.owner.toHexString();
      const isMember = isOwner || board.members.find(member => member._id.toHexString() === decoded._id);

      if (isOwner || (isMember && !board.isReadOnly)) {
        cards.forEach((card) => {
          const dataToUpdate = {
            position: card.position,
            column: card.column,
          };

          board.updateCard(card._id, dataToUpdate);
        });

        const savedBoard = await board.save().catch((err) => {
          console.log('Could not save board with a new card positions', err);
          return Promise.reject(new Error('Could not save the board with a new card positions'));
        });

        const activities = await savedBoard.getActivities();

        return res.status(200).send({ ...savedBoard._doc, timeOfLastChange: timeOfChange, activities });
      }

      res.status(400).send({ err: 'Only board owner can change card positions' });
    } catch (e) {
      console.log('Send error response', e);
      res.status(400).send({ err: e.message });
    }
  });
};

module.exports = updateCardPositions;
