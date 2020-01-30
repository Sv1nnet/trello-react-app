const jwt = require('jsonwebtoken');

const { Board } = require('../../models/Board');
const { Card } = require('../../models/Card');

const addActivity = require('../../utils/addActivity');

const updateCardComment = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { cardId } = req.params;
  const { dataToUpdate } = req.body;

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
        const cardToUpdate = await Card.findById(cardId);

        for (const prop in dataToUpdate) {
          switch (prop) {
            case 'title':
              activityData = [
                'card',
                {
                  type: 'title',
                  data: {
                    boardId,
                    sourceId: cardId,
                    authorId: decoded._id,
                    date: new Date(),
                    prevTitle: cardToUpdate.title,
                    newTitle: dataToUpdate[prop],
                  },
                },
              ];
              break;
            case 'description':
              activityData = [
                'card',
                {
                  type: 'description',
                  data: {
                    boardId,
                    sourceId: cardId,
                    authorId: decoded._id,
                    date: new Date(),
                    title: cardToUpdate.title,
                  },
                },
              ];
              break;
            default:
              break;
          }

          board.updateCard(cardId, dataToUpdate);
        }

        let savedBoard = await board.save().catch((err) => {
          console.log('Could not save board with a new card positions', err);
          return Promise.reject(new Error('Could not save the board with a new card positions'));
        });

        if (activityData) {
          const result = await addActivity(
            activityData[0],
            activityData[1],
          );

          savedBoard = result.updatedBoard;
        }

        const activities = await savedBoard.getActivities();

        return res.status(200).send({ ...savedBoard._doc, activities });
      }

      res.status(400).send({ err: 'Only board owner can change card positions' });
    } catch (e) {
      console.log('Send error response', e);
      res.status(400).send({ err: e.message });
    }
  });
};

module.exports = updateCardComment;
