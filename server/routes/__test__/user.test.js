/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
const { expect } = require('chai');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../../index');
const { User } = require('../../models/User');
const { users, populateUsers, initNewUser } = require('../../test/seed');

function userRequests() {
  beforeEach(populateUsers);

  describe('POST /user', function() {
    this.timeout(10000);

    it('Should return new user info email, nick, firstName, lastName on post /user', (done) => {
      const token = users[0].tokens.find(token => token.access === 'auth');
      const tokenAccess = token.access;
      const newUserData = {
        email: 'new@email.com',
        nick: 'new_nick',
        firstName: 'firstname',
        lastName: 'lastname',
      };

      request(app)
        .post('/user')
        .set('Authorization', `Bearer ${token.token}`)
        .send({ credentials: newUserData, tokenAccess })
        .expect(200)
        .expect((res) => {
          expect(res.body.email).to.equal(newUserData.email);
          expect(res.body.nick).to.equal(newUserData.nick);
          expect(res.body.firstName).to.equal(newUserData.firstName);
          expect(res.body.lastName).to.equal(newUserData.lastName);
          expect(res.headers.authorization.split(' ')[1]).to.equal(token.token);
        })
        .end((err) => {
          if (err) return done(err);

          done();
        });
    });

    it('Should return 400 if tokenAccess is not "auth"', (done) => {
      const token = users[0].tokens.find(token => token.access === 'auth');
      const tokenAccess = 'conf';
      const newUserData = {
        email: 'new@email.com',
        nick: 'new_nick',
        firstName: 'firstname',
        lastName: 'lastname',
      };

      request(app)
        .post('/user')
        .set('Authorization', `Bearer ${token.token}`)
        .send({ credentials: newUserData, tokenAccess })
        .expect(400)
        .end((err) => {
          if (err) return done(err);

          done();
        });
    });

    it('Should return 401 if token is not valid', (done) => {
      const token = users[0].tokens.find(token => token.access === 'auth');
      const tokenAccess = 'auth';
      const newUserData = {
        email: 'new@email.com',
        nick: 'new_nick',
        firstName: 'firstname',
        lastName: 'lastname',
      };

      request(app)
        .post('/user')
        .set('Authorization', `Bearer ${token.token}123`)
        .send({ credentials: newUserData, tokenAccess })
        .expect(401)
        .end((err) => {
          if (err) return done(err);

          done();
        });
    });
  });

  describe('POST /user/signup', function() {
    this.timeout(10000);

    it('Should return a new user on post /user/signup if comfinrmed or confirmed that equals false', (done) => {
      const newUser = new User({
        email: 'sv@mail.com',
        password: '12345678',
        nick: 'nick_3',
      });

      request(app)
        .post('/user/signup')
        .send({ credentials: { email: newUser.email, password: '12345678', nick: newUser.nick } })
        .expect(200)
        .expect((res) => {
          if (res.body.confirmed) {
            expect(res.body.email).to.equal(newUser.email);
          } else {
            expect(res.body.confirmed).to.equal(false);
          }
        })
        .end((err, res) => {
          if (err) return done(err);

          done();
        });
    });

    it('Should return 400 on post /user/signup if credentials are wrong', (done) => {
      const newUser = new User({
        email: 'sv@mailcom',
        password: '1234567',
        nick: '',
      });

      request(app)
        .post('/user/signup')
        .send({ credentials: { email: newUser.email, password: newUser.password, nick: newUser.nick } })
        .expect(400)
        .expect((res) => {
          expect(res.body.err).to.equal('Could not create a new user');
        })
        .end((err, res) => {
          if (err) return done(err);

          done();
        });
    });
  });

  describe('POST /user/login', function() {
    this.timeout(10000);

    it('Should return auth token and user info email, nick, firstName, lastName, boards on post /user/login', (done) => {
      User.findByIdAndUpdate(
        {
          _id: users[0]._id,
        },
        {
          $set: {
            confirmed: true,
          },
        },
        {
          new: true,
        },
      )
        .then((user) => {
          request(app)
            .post('/user/login')
            .send({ credentials: { email: users[0].email, password: '12345678' } })
            .expect(200)
            .expect((res) => {

              expect(res.body.email).to.equal(user.email);
              expect(res.body.nick).to.equal(user.nick);
              expect(res.body.token.access).to.equal(user.tokens[1].access);
            })
            .end((err) => {
              if (err) return done(err);

              done();
            });
        });
    });

    it('Should return confirmed equals false on post /user/login', (done) => {

      request(app)
        .post('/user/login')
        .send({ credentials: { email: users[0].email, password: '12345678' } })
        .expect(200)
        .expect((res) => {
          expect(res.body.confirmed).to.equal(false);
          expect(res.body.token).to.equal(undefined);
        })
        .end((err) => {
          if (err) return done(err);

          done();
        });
    });

    it('Should return 400 if user doesn\'t exits on post /user/login', (done) => {
      request(app)
        .post('/user/login')
        .send({ credentials: { email: 'wrong@mail.com', password: '12345678' } })
        .expect(400)
        .expect((res) => {
          expect(res.body.err).to.equal('There is no such user');
        })
        .end((err) => {
          if (err) return done(err);

          done();
        });
    });

    it('Should return 400 if passwrod wrong on post /user/login', (done) => {
      request(app)
        .post('/user/login')
        .send({ credentials: { email: users[0].email, password: '1234567s8' } })
        .expect(400)
        .expect((res) => {
          expect(res.body.err).to.equal('Password is wrong');
        })
        .end((err) => {
          if (err) return done(err);

          done();
        });
    });
  });

  describe('GET /user/confirmation/:token', function() {
    this.timeout(10000);

    it('Should return user and set confirmed true on post /user/confirmation/:token', (done) => {
      const newUser = new User({
        email: 'new@email.com',
        nick: 'new_nick',
        firstName: 'firstname',
        lastName: 'lastname',
        password: '12345678',
      });

      initNewUser(newUser, true);
      newUser.save();

      const token = newUser.tokens.find(userToken => userToken.access === 'conf');

      request(app)
        .get(`/user/confirmation/${token.token}`)
        .send()
        .expect(200)
        .expect((res) => {
          expect(res.body.email).to.equal(newUser.email);
          User.findById(newUser._id)
            .then((user) => {
              expect(user.confirmed).to.equal(true);
            });
        })
        .end((err) => {
          if (err) return done(err);

          done();
        });
    });
  });

  describe('POST /user/logout', function() {
    this.timeout(10000);

    it('Should return 200 and auth token doens\'t exist', (done) => {

      const token = users[0].tokens.find(userToken => userToken.access === 'conf');

      request(app)
        .post('/user/logout')
        .set('Authorization', `Bearer ${token.token}`)
        .send()
        .expect(200)
        .expect((res) => {
          User.findById(users[0]._id)
            .then((user) => {
              expect(user.tokens.find(userToken => userToken.access === 'auth')).to.equal(undefined);
            })
            .catch(err => done(err));
        })
        .end((err) => {
          if (err) return done(err);

          done();
        });
    });

    it('Should return 401 if token is not valid', (done) => {
      const token = users[0].tokens.find(userToken => userToken.access === 'conf');

      request(app)
        .post('/user/logout')
        .set('Authorization', `Bearer ${token.token}123`)
        .send()
        .expect(401)
        .expect((res) => {
          expect(res.body.err).to.equal('Invalid token');
        })
        .end((err) => {
          if (err) return done(err);

          done();
        });
    });
  });
}

module.exports = {
  userRequests,
};
