const jwt = require('jsonwebtoken');
const { User } = require('../../models/User');

const getUserBoards = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(400).send({ err: 'Invalid token' });
    } else {
      User.findById({ _id: decoded._id })
        .then((user) => {
          const { boards } = user;
          res.status(200).send({ boards });
        })
        .catch((err) => {
          console.log('Error finding user', err);
          res.status(400).send({ err });
        });
    }
  });
};

module.exports = getUserBoards;
