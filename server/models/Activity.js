const mongoose = require('mongoose');

const { Schema } = mongoose;
const { User } = require('./User');

const activityMessages = require('../utils/activityMessages');


const ActivitySchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // ID of object that invoke activity. We need it to find this activity and delete
  // when user deletes card, column, comment, etc.
  sourceId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  sourceType: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    required: true,
  },
  actionData: {
    type: Object,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

ActivitySchema.methods.getAuthorName = async function getAuthorName() {
  const activity = this;

  try {
    const author = await User.findById(activity.authorId).catch((err) => {
      console.log('Could not find author by id in activity.getMessage', err);

      return Promise.reject(new Error('User not found'));
    });

    return `${author.firstName} ${author.lastName} (${author.nickname})`;
  } catch (error) {
    console.log(error);

    return 'Could not get author name';
  }
};

/**
 * These are data you need to pass with data in action:
 * 1) for board actions: addMember, removeMember - "name" is a name of the member; rename - "name" is a new name of the board;
 * 2) for column actions: create, delete - "name" is a name of the column; rename - "prevName" is previous a name of the column and "newName" is a new name of the column;
 * 3) for card actions: create, delete, description - "name" is a name of the card; rename - "prevName" and "newName" are card names; moved - "cardName" is a card name, "prevName" is the source column's name, "newName" is the target column's name; addComment - "comment" comment's body, "name" - card name;
 */

ActivitySchema.methods.getMessage = async function getMessage() {
  const activity = this;

  try {
    const author = await User.findById(activity.authorId).catch((err) => {
      console.log('Could not find author by id in activity.getMessage', err);

      return Promise.reject(new Error('User not found'));
    });

    const authorStr = `${author.firstName} ${author.lastName} (${author.nickname})`;
    const action = {
      data: { ...activity.actionData },
      type: activity.messageType,
    };

    return activityMessages[activity.sourceType](authorStr, action);
  } catch (error) {
    console.log(error);

    return 'Could not get activity message';
  }
};

const Activity = mongoose.model('activities', ActivitySchema);

module.exports = {
  ActivitySchema,
  Activity,
};
