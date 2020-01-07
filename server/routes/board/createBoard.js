const jwt = require('jsonwebtoken');
const { Board } = require('../../models/Board');
const { User } = require('../../models/User');

const createBoard = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(400).send({ err: 'Invalid token' });
    } else {
      User.findById({ _id: decoded._id })
        .then((user) => {
          if (user) {
            const board = new Board({
              owner: user._id,
              title: req.body.title,
              members: [
                {
                  _id: user._id,
                  email: user.email,
                  nickname: user.nickname,
                },
              ],
              description: req.body.description,
              isPrivate: req.body.access === 'private',
              isReadOnly: true,
            });

            board.save()
              .then((board) => {
                user.boards.push({
                  _id: board._id,
                  title: board.title,
                });
                return user.save().catch(err => console.log('Error saving user with new board', err));
              })
              .then(doc => res.status(200).send({
                _id: board._id,
                title: board.title,
                owner: user.nickname,
                description: board.description,
                members: [{
                  _id: user._id,
                  email: user.email,
                  nickname: user.nickname,
                }],
                isPrivate: board.isPrivate,
                isReadOnly: board.isReadOnly,
                marks: board.marks,
                boards: board.boards,
                columns: board.columns,
                cards: board.cards,
              }));
          } else {
            res.status(400).json({ err: 'Could not find the user' });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ err });
        });
    }
  });
};

module.exports = createBoard;
