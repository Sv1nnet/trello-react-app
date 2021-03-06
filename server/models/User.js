/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const IP = process.env.NODE_ENV === 'prod' ? process.env.ADDRESS : process.env.DEV_IP;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 5,
    trim: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: '{VALUE} is not a valid email.',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
    default: '',
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  boards: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
  ],
  tokens: [
    {
      access: {
        type: String,
        required: true,
        validate: {
          validator(type) {
            return type === 'auth' || type === 'conf' || type === 'reset';
          },
          message: '{VALUE} is not a valid type of token.',
        },
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.isValidPassword = function isValidPassword(password) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

UserSchema.methods.hashPassword = function hashPassword(password) {
  const user = this;
  user.password = bcrypt.hashSync(password, 10);

  return user.password;
};

UserSchema.methods.generateConfirmationToken = function generateAndSetConfirmationToken() {
  const user = this;
  const confirmationToken = {
    access: 'conf',
    token: user.generateJWT(),
  };

  const currentToken = user.tokens.find(token => token.access === 'conf');

  if (!currentToken) {
    user.tokens.push(confirmationToken);
  } else {
    // If confirmation token exists then detele the one and push a new one
    user.tokens = user.tokens.filter(token => token.access === 'conf');
    user.tokens.push(confirmationToken);
  }
};

UserSchema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
  const user = this;
  const confirmationToken = user.tokens.find(token => token.access === 'conf').token;
  const url = `${IP}${process.env.NODE_ENV === 'prod' ? '' : process.env.BACK_PORT}/user/confirmation/${confirmationToken}`;

  return url;
};

UserSchema.methods.confirmRegistration = function confirmRegistration() {
  const user = this;
  user.confirmed = true;
};

UserSchema.methods.generateResetPasswordUrl = function generateResetPasswordUrl() {
  const user = this;
  const resetPasswordToken = user.tokens.find(token => token.access === 'reset').token;
  const url = `${IP}${process.env.NODE_ENV === 'prod' ? '' : process.env.BACK_PORT}/user/reset_password/${resetPasswordToken}`;

  return url;
};

UserSchema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
  const user = this;
  const resetPasswordToken = {
    access: 'reset',
    token: user.generateJWT(),
  };

  const currentToken = user.tokens.find(token => token.access === 'reset');

  if (!currentToken) {
    user.tokens.push(resetPasswordToken);
  } else {
    // If reset password token exists then detele the one and push a new one
    user.tokens = user.tokens.filter(token => token.access !== 'reset');
    user.tokens.push(resetPasswordToken);
  }
};

UserSchema.methods.generateAuthObject = function generateAuthObject() {
  const user = this;
  const authToken = {
    access: 'auth',
    token: user.generateJWT(),
  };

  user.tokens.push(authToken);

  return {
    _id: user._id,
    email: user.email,
    nickname: user.nickname,
    firstName: user.firstName,
    lastName: user.lastName,
    boards: user.boards,
    token: authToken,
  };
};

UserSchema.methods.generateAuthToken = function generateAuthToken() {
  const user = this;
  const authToken = {
    access: 'auth',
    token: user.generateJWT(),
  };

  user.tokens.push(authToken);

  return authToken;
};

UserSchema.methods.generateJWT = function generateJWT() {
  const user = this;
  return jwt.sign({
    email: user.email,
    _id: user._id,
    confirmed: user.confirmed,
  }, process.env.JWT_SECRET);
};

UserSchema.methods.updateBoardTitle = function updateBoardTitle(boardToUpdate) {
  const user = this;
  user.boards = user.boards.map((board) => {
    if (board._id.toHexString() === boardToUpdate._id.toHexString()) {
      board.title = boardToUpdate.title;
    }
    return board;
  });
};

UserSchema.methods.addBoard = function addBoard(board) {
  const user = this;
  user.boards.push(board);

  return user.boards;
};

UserSchema.methods.removeBoard = function removeBoard(board) {
  const user = this;
  user.boards = user.boards.filter(userBoard => userBoard._id.toHexString() !== board._id);

  return user.boards;
};

UserSchema.methods.updateCredentials = function updateCredentials(credentials) {
  const user = this;

  for (const cred in credentials) {
    user[cred] = credentials[cred];
  }
};

const User = mongoose.model('users', UserSchema);

module.exports = {
  User,
};
