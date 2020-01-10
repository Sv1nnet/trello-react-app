const getBoardMessage = (author, action) => {
  switch (action.type) {
    case 'create':
      return `${author} created the board`;
    case 'description':
      return `${author} updated a board description`;
    case 'addMember':
      return `${author} added a ${action.data.name} to board members`;
    case 'removeMember':
      return `${author} removed a ${action.data.name} from board members`;
    case 'rename':
      return `${author} renamed the board as ${action.data.name}`;
    case 'setReadonly':
      return `${author} set the board Readonly`;
    case 'setEditable':
      return `${author} set the board Editable`;
    case 'setPrivate':
      return `${author} set the board Private`;
    case 'setPublic':
      return `${author} set the board Public`;
    default:
      return null;
  }
};

const getColumnMessage = (author, action) => {
  switch (action.type) {
    case 'create':
      return `${author} created the column ${action.data.name}`;
    case 'rename':
      return `${author} renamed the column ${action.data.prevName} as ${action.data.newName}`;
    default:
      return null;
  }
};

const getCardMessage = (author, action) => {
  switch (action.type) {
    case 'create':
      return `${author} created the card ${action.data.name}`;
    case 'rename':
      return `${author} renamed the card ${action.data.prevName} as ${action.data.newName}`;
    case 'moved':
      return `${author} moved the card ${action.data.cardName} from ${action.data.prevName} column to ${action.data.newName} one`;
    case 'desciption':
      return `${author} updated a description for the card ${action.data.name}`;
    case 'addComment':
      return `${author} added a comment ${action.data.comment} for the card ${action.data.name}`;
    default:
      return null;
  }
};

const messages = {
  board: getBoardMessage,
  columns: getColumnMessage,
  card: getCardMessage,
};

module.exports = messages;
