/* eslint-disable no-underscore-dangle */
const { Board } = require('../models/Board');
const { User } = require('../models/User');

const boards = [];

const populateBoards = function populateBoards(done) {
  this.timeout(10000);

  Board.deleteMany({}).then(() => {
    User.find({})
      .then((users) => {
        let counter = 1; // End this task in beforeEach if we added 2 boards

        users.forEach((user) => {
          const board = new Board({
            // _id: new ObjectID(),
            owner: user._id,
            title: `Board ${counter}`,
            members: [
              {
                _id: user._id,
                email: user.email,
                nickname: user.nickname,
              },
            ],
            description: `Description for board ${counter}`,
            isPrivate: true,
            isReadOnly: true,
          });

          board.save().then((savedBoard) => {
            boards.push(savedBoard);
            user.boards.push({
              _id: savedBoard._id,
              title: savedBoard.title,
            });
            user.save().then((user) => {
              counter += 1;

              if (counter === 2) {
                done();
              }
            });
          });
        });
      })
      .catch(err => done(err));
  });
};

module.exports = {
  boards,
  populateBoards,
};
