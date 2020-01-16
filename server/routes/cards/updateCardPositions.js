/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');

const { Board } = require('../../models/Board');

const addActivity = require('../../utils/addActivity');

const updateCardPositions = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { cards, timeOfChange } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    try {
      let activityData;
      const board = await Board.findById(boardId)
        .catch((err) => {
          console.log('Could not find a board', err);
          return Promise.reject(new Error('Could not change card positions'));
        });

      const isOwner = decoded._id === board.owner.toHexString();
      const isMember = isOwner || board.members.find(member => member._id.toHexString() === decoded._id);

      if (isOwner || (isMember && !board.isReadOnly)) {
        cards.forEach(async (card) => {
          const dataToUpdate = {
            position: card.position,
            column: card.column,
          };

          const currentCard = board.cards.find(cardOnBoard => cardOnBoard._id.toHexString() === card._id);

          if (currentCard.column.toHexString() !== card.column) {
            const prevColumn = board.columns.find(column => column._id.toHexString() === currentCard.column.toHexString());
            const newColumn = board.columns.find(column => column._id.toHexString() === card.column);

            activityData = [
              'card',
              {
                type: 'moved',
                data: {
                  boardId,
                  sourceId: card._id,
                  authorId: decoded._id,
                  date: new Date(),
                  cardName: card.title,
                  prevName: prevColumn.title,
                  newName: newColumn.title,
                },
              },
            ];
          }

          board.updateCard(card._id, dataToUpdate);
        });

        let savedBoard = await board.save().catch((err) => {
          console.log('Could not save board with a new card positions', err);
          return Promise.reject(new Error('Could not save the board with a new card positions'));
        });

        if (activityData) {
          const result = await addActivity(
            activityData[0],
            activityData[1],
          );

          // eslint-disable-next-line prefer-destructuring
          savedBoard = result.updatedBoard;
        }

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
