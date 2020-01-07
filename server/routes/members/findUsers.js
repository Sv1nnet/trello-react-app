const jwt = require('jsonwebtoken');
const { User } = require('../../models/User');

const findUsers = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { email } = req.params;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).send({ err: 'Invalid token' });
    }

    User.find({})
      .then((users) => {
        const foundUsers = users
          .filter(user => user.email.toLowerCase().indexOf(email.toLowerCase()) !== -1)
          .map(user => _.pick(user, ['_id', 'boards', 'email', 'nickname']));

        res.status(200).send({ users: foundUsers, message: 'Request success' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ err: 'Error on the server' });
      });
  });
};

module.exports = findUsers;
