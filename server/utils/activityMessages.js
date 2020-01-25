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
    case 'title':
      return `${author} renamed the board as ${action.data.title}`;
    case 'isReadOnly':
      return `${author} set the board ${action.data.isReadOnly ? 'Readonly' : 'Editable'}`;
    case 'isPrivate':
      return `${author} set the board ${action.data.isPrivate ? 'Private' : 'Public'}`;
    default:
      return null;
  }
};

const getColumnMessage = (author, action) => {
  switch (action.type) {
    case 'create':
      return `${author} created the column ${action.data.title}`;
    case 'rename':
      return `${author} renamed the column ${action.data.prevTitle} as ${action.data.newTitle}`;
    default:
      return null;
  }
};

const getCardMessage = (author, action) => {
  switch (action.type) {
    case 'create':
      return `${author} created the card ${action.data.title}`;
    case 'title':
      return `${author} renamed the card ${action.data.prevTitle} as ${action.data.newTitle}`;
    case 'moved':
      return `${author} moved the card ${action.data.cardTitle} from ${action.data.prevTitle} column to ${action.data.newTitle} one`;
    case 'description':
      return `${author} updated a description for the card ${action.data.title}`;
    case 'addComment':
      return `${author} added a comment ${action.data.comment} for the card ${action.data.title}`;
    default:
      return null;
  }
};

const messages = {
  board: getBoardMessage,
  column: getColumnMessage,
  card: getCardMessage,
};

module.exports = messages;
