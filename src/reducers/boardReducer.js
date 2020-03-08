import { boardActionTypes, columnActionTypes, cardActionTypes } from '../types';

const initialState = {
  _id: '',
  title: '',
  owner: '',
  activities: [],
  description: '',
  isPrivate: true,
  labels: [],
  chat: '',
  cards: [],
  cashedCards: [],
  members: [],
  isReadOnly: false,
  columns: [],
  cashedColumns: [],
  timeOfLastChange: null,
};

const boardReducer = (state = initialState, action = { type: 'default', data: {} }) => {
  let cards = [];
  let columns = [];
  let data = {};
  let cardIndex = 0;

  switch (action.type) {
    case boardActionTypes.CREATED:
      data = { ...action.data };

      return {
        _id: data._id,
        owner: data.owner,
        title: data.title,
        activities: data.activities,
        description: '',
        isPrivate: data.isPrivate,
        labels: data.labels,
        cards,
        cashedCards: cards,
        members: data.members,
        isReadOnly: data.isReadOnly,
        columns,
        cashedColumns: columns,
        timeOfLastChange: null,
      };
    case boardActionTypes.BOARD_REMOVED:
    case columnActionTypes.COLUMN_DELETED:
    case columnActionTypes.COLUMN_UPDATED:
    case cardActionTypes.CARD_UPDATED:
    case boardActionTypes.BOARD_UPDATED:
    case boardActionTypes.LABEL_UPDATED:
    case boardActionTypes.BOARD_DOWNLOADED:
      data = { ...action.data };
      columns = data.columns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      });

      return {
        _id: data._id,
        owner: data.owner,
        title: data.title,
        activities: data.activities,
        description: data.description,
        isPrivate: data.isPrivate,
        labels: data.labels,
        cards: data.cards,
        cashedCards: data.cards,
        members: data.members,
        isReadOnly: data.isReadOnly,
        columns,
        cashedColumns: columns,
        timeOfLastChange: null,
      };
    case columnActionTypes.COLUMN_POSITIONS_UPDATED:
      data = { ...action.data };

      if (data.timeOfLastChange === state.timeOfLastChange) {
        columns = data.columns.sort((columnOne, columnTwo) => {
          if (columnOne.position < columnTwo.position) return -1;
          if (columnOne.position > columnTwo.position) return 1;
          return 0;
        });
      } else {
        columns = [...state.columns];
      }

      return {
        _id: data._id,
        owner: data.owner,
        title: data.title,
        activities: data.activities,
        description: data.description,
        isPrivate: data.isPrivate,
        labels: data.labels,
        cards: state.cards,
        cashedCards: data.cards,
        members: data.members,
        isReadOnly: data.isReadOnly,
        columns,
        cashedColumns: columns,
        timeOfLastChange: null,
      };
    case cardActionTypes.CARD_LOCAL_CHANGES_UPDATED:
    case cardActionTypes.CARD_POSITIONS_UPDATED:
      data = { ...action.data };

      if (data.timeOfLastChange === state.timeOfLastChange) {
        cards = [...data.cards];
      } else {
        cards = [...state.cards];
      }

      columns = data.columns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      });

      return {
        _id: data._id,
        owner: data.owner,
        title: data.title,
        activities: data.activities,
        description: data.description,
        isPrivate: data.isPrivate,
        labels: data.labels,
        cards,
        cashedCards: cards,
        members: data.members,
        isReadOnly: data.isReadOnly,
        columns: data.columns,
        cashedColumns: data.columns,
        timeOfLastChange: null,
      };
    case columnActionTypes.COLUMN_POSITIONS_SWITCHED:
      data = { ...action.data };

      columns = action.data.columns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      });

      return {
        ...state,
        timeOfLastChange: data.timeOfChange,
        columns,
      };
    case cardActionTypes.LABEL_ATTACHED:
    case cardActionTypes.LABEL_REMOVED:
    case cardActionTypes.CARD_POSITIONS_SWITCHED:
      cards = [...action.data.cards];
      return {
        ...state,
        timeOfLastChange: data.timeOfChange,
        cards,
      };
    case boardActionTypes.BOARD_MEMBER_ADDED:
      data = { ...action.data };
      columns = data.board.columns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      });

      return {
        _id: data.board._id,
        owner: data.board.owner,
        title: data.board.title,
        activities: data.board.activities,
        description: data.board.description,
        isPrivate: data.board.isPrivate,
        labels: data.board.labels,
        cards: data.board.cards,
        cashedCards: data.board.cards,
        members: data.board.members,
        isReadOnly: data.board.isReadOnly,
        columns,
        cashedColumns: columns,
        timeOfLastChange: null,
      };
    case boardActionTypes.BOARD_MEMBER_REMOVED:
      data = { ...action.data };
      columns = data.board.columns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      });

      return {
        _id: data.board._id,
        owner: data.board.owner,
        title: data.board.title,
        activities: data.board.activities,
        description: data.board.description,
        isPrivate: data.board.isPrivate,
        labels: data.board.labels,
        cards: data.board.cards,
        cashedCards: data.board.cards,
        members: data.board.members,
        isReadOnly: data.board.isReadOnly,
        columns,
        cashedColumns: columns,
        timeOfLastChange: null,
      };
    case boardActionTypes.BOARD_MEMBERS_RECEIVED:
      data = { ...action.data };
      return {
        ...state,
        members: data.members,
      };
    case columnActionTypes.COLUMN_CREATED:
      data = { ...action.data };
      return {
        ...state,
        columns: [...state.columns, data.column],
        activities: data.activities,
      };
    case cardActionTypes.CARD_CREATED:
      data = { ...action.data };
      cards = [...state.cards, data.card];

      return {
        ...state,
        activities: data.activities,
        cards,
        cashedCards: cards,
      };
    case cardActionTypes.CARD_COMMENT_ADDED:
    case cardActionTypes.CARD_COMMENT_UPDATED:
    case cardActionTypes.CARD_COMMENT_DELETED:
      data = { ...action.data };
      cards = [...state.cards];

      cardIndex = cards.findIndex(card => card._id === data.card._id);
      cards.splice(cardIndex, 1, data.card);

      return {
        ...state,
        activities: [...data.activities],
        cards,
        cashedCards: cards,
      };
    case cardActionTypes.CARD_DELETED:
      data = { ...action.data };
      cards = [...data.cards];

      return {
        ...state,
        activities: data.activities,
        cards,
        cashedCards: cards,
      };
    case boardActionTypes.ACTIVITIES_LOADED:
      data = { ...action.data };

      return {
        ...state,
        activities: data.activities,
      };
    case boardActionTypes.CLEAN_ACTIVITIES:
      return {
        ...state,
        activities: state.activities.slice(0, 10),
      };
    case boardActionTypes.ACTIVITIES_LOADING_FAILED:
    case columnActionTypes.COLUMN_POSITIONS_UPDATE_FAILED:
    case cardActionTypes.CARD_POSITIONS_UPDATE_FAILED:
    case boardActionTypes.BOARD_UPDATE_FAILED:
    case boardActionTypes.LABEL_UPDATE_FAILED:
    case cardActionTypes.CARD_DELETE_FAILED:
    case cardActionTypes.CARD_COMMENT_ADD_FALIED:
    case cardActionTypes.CARD_COMMENT_UPDATE_FALIED:
    case cardActionTypes.CARD_COMMENT_DELETE_FALIED:
    case cardActionTypes.LABEL_ATTACH_FAILED:
    case cardActionTypes.LABEL_REMOVE_FAILED:
    case cardActionTypes.CARD_LOCAL_CHANGES_UPDATE_FAILED:
    case columnActionTypes.COLUMN_CREATE_FAILED:
    case columnActionTypes.COLUMN_DELETE_FAILED:
      return {
        ...state,
        cards: state.cashedCards,
        columns: state.cashedColumns,
      };
    case boardActionTypes.CLEAR_BOARD_DATA:
      return {
        ...initialState,
      };
    default:
      return {
        ...state,
      };
  }
};

export default boardReducer;
