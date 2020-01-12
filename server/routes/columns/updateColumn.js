const jwt = require('jsonwebtoken');
const { Board } = require('../../models/Board');
const { Column } = require('../../models/Column');

const addActivity = require('../../utils/addActivity');

const updateColumn = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { columnId } = req.params;
  const { dataToUpdate } = req.body;
  console.log(req.body)

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    try {
      const board = await Board.findById(boardId)
        .catch((err) => {
          console.log('Could not find a board', err);
          return Promise.reject(new Error('Could not delete a column'));
        });

      const isOwner = decoded._id === board.owner.toHexString();
      const isMember = isOwner || board.members.find(member => member._id.toHexString() === decoded._id);

      if (isOwner || (isMember && !board.isReadOnly)) {
        const columnToUpdate = await Column.findById(columnId);
        board.updateColumn(columnId, dataToUpdate);

        const savedBoard = await board.save().catch((err) => {
          console.log('Could not save board with a new column', err);
          return Promise.reject(new Error('Could not save the board with a new column'));
        });

        const propToUpdate = Object.keys(dataToUpdate)[0];
        if (propToUpdate === 'title') {
          const { activity, updatedBoard, error } = await addActivity(
            'column',
            {
              type: 'rename',
              data: {
                authorId: decoded._id,
                sourceId: columnId,
                boardId: savedBoard._id.toHexString(),
                date: new Date().toString(),
                prevName: columnToUpdate.title,
                newName: dataToUpdate[propToUpdate],
              },
            },
          );
        }

        const activities = await updatedBoard.getActivities();
        return res.status(200).send({ ...updatedBoard._doc, activities });
      }

      res.status(400).send({ err: 'Only board owner can remove new columns' });
    } catch (e) {
      console.log('Send error response', e);
      res.status(400).send({ err: e.message });
    }
  });
};

module.exports = updateColumn;
