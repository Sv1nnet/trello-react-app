const jwt = require('jsonwebtoken');
const { Board } = require('../../models/Board');

const getActivities = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const boardId = req.params.id;
  const { start, number } = req.query;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    try {
      const board = await Board.findById(boardId);
      const activities = await board.getActivities(start, number);

      return res.status(200).send({ message: 'Activities found', activities });
    } catch (e) {
      return res.status(400).send({ err: 'Could not find activities' });
    }
  });
};

module.exports = getActivities;
