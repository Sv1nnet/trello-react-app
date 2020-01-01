/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { boardActionTypes, columnActionTypes, cardActionTypes } from '../types';

const initialState = {
  _id: '',
  title: '',
  owner: '',
  history: [],
  description: '',
  isPrivate: true,
  marks: [
    {
      color: 'yellow',
      title: '',
      _id: '4893284023u4ej890jfoijfwe0',
    },
    {
      color: 'green',
      title: '',
      _id: '4893284023uasdasd0jfoijfwe0',
    },
    {
      color: 'red',
      title: '',
      _id: '48932840234645t90jfoijfwe0',
    },
  ],
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

  switch (action.type) {
    case boardActionTypes.CREATED:
      data = { ...action.data };

      return {
        _id: data._id,
        owner: data.owner,
        title: data.title,
        history: [],
        description: '',
        isPrivate: data.isPrivate,
        marks: data.marks,
        cards,
        cashedCards: cards,
        members: data.members,
        isReadOnly: data.isReadOnly,
        columns,
        cashedColumns: columns,
      };
    case columnActionTypes.COLUMN_DELETED:
    case columnActionTypes.COLUMN_UPDATED:
    case boardActionTypes.BOARD_UPDATED:
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
        history: [],
        description: '',
        isPrivate: data.isPrivate,
        marks: data.marks,
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
        history: [],
        description: '',
        isPrivate: data.isPrivate,
        marks: data.marks,
        cards: data.cards,
        cashedCards: data.cards,
        members: data.members,
        isReadOnly: data.isReadOnly,
        columns,
        cashedColumns: columns,
        timeOfLastChange: null,
      };
    case cardActionTypes.CARD_POSITIONS_UPDATED:
      data = { ...action.data };
      columns = data.columns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      });

      if (data.timeOfLastChange === state.timeOfLastChange) {
        cards = [...data.cards];
      } else {
        cards = [...state.cards];
      }

      return {
        _id: data._id,
        owner: data.owner,
        title: data.title,
        history: [],
        description: '',
        isPrivate: data.isPrivate,
        marks: data.marks,
        cards,
        cashedCards: data.cards,
        members: data.members,
        isReadOnly: data.isReadOnly,
        columns,
        cashedColumns: columns,
        timeOfLastChange: null,
      };
    case columnActionTypes.COLUMN_POSITIONS_SWITCHED:
      columns = action.data.columns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      });

      return {
        ...state,
        columns,
      };
    case cardActionTypes.CARD_POSITIONS_SWITCHED:
      cards = [...action.data.cards];
      return {
        ...state,
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
        history: [],
        description: '',
        isPrivate: data.board.isPrivate,
        marks: data.board.marks,
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
        history: [],
        description: '',
        isPrivate: data.board.isPrivate,
        marks: data.board.marks,
        cards: data.board.cards,
        cashedCards: data.board.cards,
        members: data.board.members,
        isReadOnly: data.board.isReadOnly,
        columns,
        cashedColumns: columns,
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
      };
    case cardActionTypes.CARD_CREATED:
      data = { ...action.data };

      return {
        ...state,
        cards: [...state.cards, data.card],
      };
    case cardActionTypes.CARD_DELETED:
      data = { ...action.data };
      cards = [...data.cards];

      return {
        ...state,
        cards: data.cards,
      };
    case columnActionTypes.COLUMN_POSITIONS_UPDATE_FAILED:
    case cardActionTypes.CARD_POSITIONS_UPDATE_FAILED:
    case boardActionTypes.BOARD_UPDATE_FAILED:
    case cardActionTypes.CARD_DELETE_FAILED:
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
