const jwt = require('jsonwebtoken');

const { Board } = require('../../models/Board');

const deleteCardComment = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { cardId, commentId } = req.params;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    try {
      const board = await Board.findById(boardId)
        .catch((err) => {
          console.log('Could not find a board', err);
          return Promise.reject(new Error('Could not delete a comment'));
        });

      const isOwner = decoded._id === board.owner.toHexString();
      const isMember = isOwner || board.members.find(member => member._id.toHexString() === decoded._id);

      if (isOwner || (isMember && !board.isReadOnly)) {
        const cardToUpdate = board.cards.find(card => card._id.toHexString() === cardId);
        cardToUpdate.deleteComment(commentId);
        board.removeActivities(commentId);

        const savedBoard = await board.save().catch((err) => {
          console.log('Could not save board with a new comment', err);
          return Promise.reject(new Error('Could not save board with a new comment'));
        });

        const activities = await savedBoard.getActivities();

        return res.status(200).send({ card: cardToUpdate, activities });
      }

      res.status(400).send({ err: 'Only board owner can delete comments' });
    } catch (e) {
      console.log('Send error response', e);
      res.status(400).send({ err: e.message });
    }
  });
};

module.exports = deleteCardComment;
