const jwt = require('jsonwebtoken');
const { Board } = require('../../models/Board');

const updateLabel = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { labelId } = req.params;
  const { title } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      req.status(400).send({ err: 'Invalid token' });
    } else {
      const board = await Board.findById(boardId);

      if (board) {
        const isOwner = board.owner.toHexString() === decoded._id;

        if (!isOwner) {
          res.status(400).send({ err: 'Only board owner can change board settings and content' });
        } else {
          try {
            board.updateLabel(labelId, { title });

            const updatedBoard = await board.save().catch(() => {
              return Promise.reject(new Error('Could not save the board with updated label'));
            });

            const activities = await board.getActivities();

            res.status(200).send({ ...updatedBoard, activities });
          } catch (e) {
            console.log(e);
            res.status(400).send({ err: 'Could not update board in updating' });
          }
        }
      } else {
        res.status(400).send({ err: 'Could not find the board' });
      }
    }
  });
};

module.exports = updateLabel;
