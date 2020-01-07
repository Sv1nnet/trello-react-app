const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { Card } = require('../../models/Card');
const { Board } = require('../../models/Board');

const createCard = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { card } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    try {
      const board = await Board.findById(boardId)
        .catch((err) => {
          console.log('Could not find a board', err);
          return Promise.reject(new Error('Could not create a card'));
        });

      const isOwner = decoded._id === board.owner.toHexString();
      const isMember = isOwner || board.members.find(member => member._id.toHexString() === decoded._id);

      if (isOwner || (isMember && !board.isReadOnly)) {
        const newCard = await new Card({ ...card }).save().catch((err) => {
          console.log('Could not save card', err);
          return Promise.reject(new Error('Could not create a new card'));
        });
        board.addCard(newCard);

        await board.save().catch((err) => {
          console.log('Could not save board with a new card', err);
          return Promise.reject(new Error('Could not save the board with a new card'));
        });

        return res.status(200).send({ card: _.pick(newCard, ['_id', 'title', 'position', 'column', 'marks', 'description', 'comments']) });
      }

      res.status(400).send({ err: 'Only board owner can add new cards' });
    } catch (e) {
      console.log('Send error response', e);
      res.status(400).send({ err: e.message });
    }
  });
};

module.exports = createCard;
