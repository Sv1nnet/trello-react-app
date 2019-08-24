/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
const { expect } = require('chai');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../../index');
const { Board } = require('../../models/Board');
const { User } = require('../../models/User');
const { users, populateUsers } = require('../../test/userSeed');
const { boards, populateBoards } = require('../../test/boardSeed');

function boardRequests() {
  // beforeEach(populateUsers);
  beforeEach(populateBoards);

  describe('POST /board', function() {
    this.timeout(10000);

    it('Should create and return new board /boards', (done) => {
      const newBoard = {
        title: 'New board title',
        description: 'new board description',
        access: 'private',
      };

      User.findById({ _id: users[0]._id })
        .then((user) => {
          request(app)
            .post('/board')
            .set('Authorization', `Bearer ${user.tokens.find(token => token.access === 'auth').token}`)
            .send(newBoard)
            .expect(200)
            .expect((res) => {
              expect(res.body.title).to.equal(newBoard.title);
              expect(res.body.owner).to.equal(users[0].nickname);
              expect(res.body.description).to.equal(newBoard.description);
              expect(res.body.isPrivate).to.equal(true);
            })
            .end((err) => {
              if (err) return done(err);

              done();
            });
        });
    });

    it('Should return 400 if token is invalid', (done) => {
      const newBoard = {
        title: 'New board title',
        description: 'new board description',
        access: 'private',
      };

      User.findById({ _id: users[0]._id })
        .then((user) => {
          request(app)
            .post('/board')
            .set('Authorization', `Bearer ${user.tokens.find(token => token.access === 'auth').token}0`)
            .send(newBoard)
            .expect(400)
            .expect((res) => {
              expect(res.body.err).to.equal('Invalid token');
            })
            .end((err) => {
              if (err) return done(err);

              done(err);
            });
        });
    });
  });

  describe('GET /board/all', function() {
    this.timeout(10000);

    it('Should return all user\'s boards', (done) => {
      let reponseBoards;

      request(app)
        .get('/board/all')
        .set('Authorization', `Baerer ${users[0].tokens.find(token => token.access === 'auth').token}`)
        .send()
        .expect(200)
        .expect((res) => {
          reponseBoards = [...res.body.boards];
        })
        .end((err) => {
          if (err) return done(err);

          User.findById({ _id: users[0]._id })
            .then((user) => {
              reponseBoards.forEach((board, i) => expect(board._id).to.equal(user.boards[i]._id.toHexString()));
              done();
            });
        });
    });

    it('Should return 400 if token is invalid', (done) => {
      request(app)
        .get('/board/all')
        .set('Authorization', `Bearer ${users[0].tokens.find(token => token.access === 'auth').token}2`)
        .send()
        .expect(400)
        .expect((res) => {
          expect(res.body.err).to.equal('Invalid token');
        })
        .end((err) => {
          if (err) return done(err);

          done();
        });
    });
  });

  describe('GET /board/:id', function() {
    this.timeout(10000);


    it('Should return specific private board correspond to id in url for user that has access to it', (done) => {
      User.findById(users[0]._id)
        .then((user) => {
          const token = user.tokens.find(userToken => userToken.access === 'auth');
          const board = new Board({
            owner: user._id,
            title: 'Created in test',
            members: [
              {
                _id: user._id,
                email: user.email,
                nickname: user.nickname,
              },
            ],
            description: 'Some descrition',
            isPrivate: true,
            isReadOnly: true,
          });

          board.save()
            .then((newBoard) => {
              user.boards.push({
                _id: board._id,
                title: board.title,
              });
              user.save()
                .then(() => {
                  request(app)
                    .get(`/board/${newBoard._id}`)
                    .set('Authorization', `Bearer ${token.token}`)
                    .expect(200)
                    .expect((res) => {
                      expect(res.body._id).to.equal(newBoard._id.toHexString());
                    })
                    .end((err) => {
                      if (err) return done(err);

                      done(err);
                    });
                });
            });
        });
    });

    it('Should return 400 if board doesn\'t exist', (done) => {
      request(app)
        .get('/board/5d4f02faf445d03casdsaas')
        .send()
        .expect(400)
        .expect((res) => {
          expect(res.body.err).to.equal('Could not find the board');
        })
        .end((err) => {
          if (err) done(err);

          done();
        });
    });

    it('Should return 403 if user logged in and have no access to specified board', (done) => {
      User.findById(users[0]._id)
        .then((user) => {
          const token = users[1].tokens.find(userToken => userToken.access === 'auth');
          const board = new Board({
            owner: user._id,
            title: 'Created in test',
            members: [
              {
                _id: user._id,
                email: user.email,
                nickname: user.nickname,
              },
            ],
            description: 'Some descrition',
            isPrivate: true,
            isReadOnly: true,
          });

          board.save()
            .then((newBoard) => {
              user.boards.push({
                _id: board._id,
                title: board.title,
              });
              user.save()
                .then(() => {
                  request(app)
                    .get(`/board/${newBoard._id}`)
                    .set('Authorization', `Bearer ${token.token}`)
                    .expect(403)
                    .expect((res) => {
                      expect(res.body.err).to.equal('You have no access to this board');
                    })
                    .end((err) => {
                      if (err) return done(err);

                      done(err);
                    });
                });
            });
        });
    });

    it('Should return 403 if user is not logged in and board is private', (done) => {
      const board = new Board({
        owner: users[0]._id,
        title: 'Created in test',
        members: [
          {
            _id: users[0]._id,
            email: users[0].email,
            nickname: users[0].nickname,
          },
        ],
        description: 'Some descrition',
        isPrivate: true,
        isReadOnly: true,
      });

      board.save()
        .then((newBoard) => {
          users[0].boards.push({
            _id: board._id,
            title: board.title,
          });
          users[0].save()
            .then(() => {
              request(app)
                .get(`/board/${newBoard._id}`)
                .expect(403)
                .expect((res) => {
                  expect(res.body.err).to.equal('You have no access to this board');
                })
                .end((err) => {
                  if (err) return done(err);

                  done();
                });
            });
        });
    });
  });

  describe('GET /board/find_users/:email', function () {
    this.timeout(10000);


    it('Should return list of users matched to email', (done) => {
      const email = encodeURIComponent('svi_1');

      User.findById(users[0]._id)
        .then((user) => {
          const token = user.tokens.find(userToken => userToken.access === 'auth');

          request(app)
            .get(`/board/find_users/${email}`)
            .set('Authorization', `Bearer ${token.token}`)
            .expect(200)
            .expect((res) => {
              expect(res.body.users.length).to.equal(1);
              expect(res.body.users.every(user => user.email.indexOf(email) !== -1)).to.equal(true);
            })
            .end((err) => {
              if (err) return done(err);

              done();
            });
        });
    });
  });
}

module.exports = {
  boardRequests,
};
