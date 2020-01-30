const jwt = require('jsonwebtoken');

const { Board } = require('../../models/Board');
const { User } = require('../../models/User');

const addActivity = require('../../utils/addActivity');

const addCardComment = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { cardId } = req.params;
  const { text, date, authorId } = req.body;

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
        const cardToUpdate = board.cards.find(card => card._id.toHexString() === cardId);
        const author = await User.findById(decoded._id);
        const authorName = `${author.firstName} ${author.lastName}`;

        cardToUpdate.addComment({ text, date, authorId, authorName });

        activityData = [
          'card',
          {
            type: 'addComment',
            data: {
              boardId,
              sourceId: cardId,
              authorId: decoded._id,
              date: new Date(date),
              comment: text,
              title: cardToUpdate.title,
            },
          },
        ];


        let savedBoard = await board.save().catch((err) => {
          console.log('Could not save board with a new coment', err);
          return Promise.reject(new Error('Could not save board with a new coment'));
        });

        if (activityData) {
          const result = await addActivity(
            activityData[0],
            activityData[1],
          );

          savedBoard = result.updatedBoard;
        }

        const activities = await savedBoard.getActivities();

        return res.status(200).send({ card: cardToUpdate, activities });
      }

      res.status(400).send({ err: 'Only board owner can leave a comment' });
    } catch (e) {
      console.log('Send error response', e);
      res.status(400).send({ err: e.message });
    }
  });
};

module.exports = addCardComment;
