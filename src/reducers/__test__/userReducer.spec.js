/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { userActionTypes } from '../../types';
import userReducer from '../userReducer';

const initialState = {
  userData: {},
  token: {},
};


describe('Action SIGNEDUP', () => {
  it('Should return initial state', (done) => {
    const action = {
      type: userActionTypes.SIGNEDUP,
      data: {
        confirmed: false,
        message: 'Confirmation mail was sent',
      },
    };

    const result = userReducer(initialState, action);

    expect(result).to.not.equal(undefined);
    expect(result).to.have.keys('userData', 'token');
    expect(Object.keys(result.userData)).to.be.empty;
    expect(Object.keys(result.token)).to.be.empty;

    done();
  });
});

describe('Action LOGGEDIN', () => {
  it('Should return state with authorizated user object', (done) => {
    const action = {
      type: userActionTypes.LOGGEDIN,
      data: {
        data: {
          _id: 'justrandomidhere',
          email: 'email@mail.com',
          nickname: 'Nickname',
          firstName: 'firstname',
          lastName: 'lastname',
          boards: ['justrandomishere'],
          token: {
            access: 'auth',
            token: 'justtokenhere',
          },
        },
      },
    };

    const result = userReducer(initialState, action);

    expect(result).to.not.equal(undefined);
    expect(result).to.have.keys('userData', 'token');
    expect(result.userData).to.have.keys('_id', 'email', 'nickname', 'firstName', 'lastName', 'boards');
    expect(result.token).to.have.keys('access', 'token');
    done();
  });
});

describe('Action LOGGEDOUT', () => {
  it('Should return state with authorizated user object', (done) => {
    const action = {
      type: userActionTypes.LOGGEDOUT,
      data: {
        data: {
          _id: 'justrandomidhere',
          email: 'email@mail.com',
          nickname: 'Nickname',
          firstName: 'firstname',
          lastName: 'lastname',
          boards: ['justrandomishere'],
          token: {
            access: 'auth',
            token: 'justtokenhere',
          },
        },
      },
    };

    const result = userReducer(initialState, action);

    expect(result).to.not.equal(undefined);
    expect(result).to.have.keys('userData', 'token');
    expect(Object.keys(result.userData)).to.be.empty;
    expect(Object.keys(result.token)).to.be.empty;
    done();
  });
});
