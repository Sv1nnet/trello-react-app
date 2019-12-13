/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { boardActionTypes, columnActionTypes, cardActionTypes } from '../types';

const getSortedCards = (cards) => {
  const sortedCards = {};

  cards.forEach((card) => {
    if (!sortedCards[card.column]) sortedCards[card.column] = [];
    sortedCards[card.column].push(card);
  });

  for (const column in sortedCards) {
    sortedCards[column] = sortedCards[column].sort((cardOne, cardTwo) => {
      if (cardOne.position < cardTwo.position) return -1;
      if (cardOne.position > cardTwo.position) return 1;
      return 0;
    });
  }

  console.log('sortedCards', sortedCards)

  return sortedCards;
};


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
  members: [],
  isReadOnly: false,
  columns: [],
};

const boardReducer = (state = initialState, action = { type: 'default', data: {} }) => {
  let cards = {};
  let data = {};
  let newLocalCards = {};
  let sortedCards = {};

  switch (action.type) {
    case boardActionTypes.CREATED:
      data = { ...action.data.data };
      cards = [...data.cards];
      // sortedCards = getSortedCards(cards);

      return {
        _id: data._id,
        owner: data.owner,
        title: data.title,
        history: [],
        description: '',
        isPrivate: data.isPrivate,
        marks: data.marks,
        cards: data.cards,
        members: data.members,
        isReadOnly: data.isReadOnly,
        columns: data.columns.sort((columnOne, columnTwo) => {
          if (columnOne.position < columnTwo.position) return -1;
          if (columnOne.position > columnTwo.position) return 1;
          return 0;
        }),
      };
    case columnActionTypes.COLUMN_DELETED:
    case columnActionTypes.COLUMN_POSITIONS_UPDATED:
    case columnActionTypes.COLUMN_UPDATED:
    case boardActionTypes.BOARD_UPDATED:
    case boardActionTypes.BOARD_DOWNLOADED:
      data = { ...action.data.data };
      cards = [...data.cards];
      // sortedCards = getSortedCards(cards);

      return {
        _id: data._id,
        owner: data.owner,
        title: data.title,
        history: [],
        description: '',
        isPrivate: data.isPrivate,
        marks: data.marks,
        cards: data.cards,
        members: data.members,
        isReadOnly: data.isReadOnly,
        columns: data.columns.sort((columnOne, columnTwo) => {
          if (columnOne.position < columnTwo.position) return -1;
          if (columnOne.position > columnTwo.position) return 1;
          return 0;
        }),
      };
    case columnActionTypes.COLUMN_POSITIONS_SWITCHED:
      data = { ...action.data.data };

      return {
        ...state,
        localColumns: action.data.columns,
      };
    case cardActionTypes.CARD_POSITIONS_SWITCHED:
      cards = [...action.data.cards];
      // newLocalCards = getSortedCards(cards);
      return {
        ...state,
        cards,
      };
    case boardActionTypes.BOARD_MEMBER_ADDED:
      data = { ...action.data.data };
      cards = [...data.board.cards];
      // sortedCards = getSortedCards(cards);

      return {
        _id: data.board._id,
        owner: data.board.owner,
        title: data.board.title,
        history: [],
        description: '',
        isPrivate: data.board.isPrivate,
        marks: data.board.marks,
        cards: data.board.cards,
        members: data.board.members,
        isReadOnly: data.board.isReadOnly,
        columns: data.board.columns.sort((columnOne, columnTwo) => {
          if (columnOne.position < columnTwo.position) return -1;
          if (columnOne.position > columnTwo.position) return 1;
          return 0;
        }),
      };
    case boardActionTypes.BOARD_MEMBER_REMOVED:
      data = { ...action.data.data };

      return {
        _id: data.board._id,
        owner: data.board.owner,
        title: data.board.title,
        history: [],
        description: '',
        isPrivate: data.board.isPrivate,
        marks: data.board.marks,
        cards: data.board.cards,
        members: data.board.members,
        isReadOnly: data.board.isReadOnly,
        columns: data.board.columns.sort((columnOne, columnTwo) => {
          if (columnOne.position < columnTwo.position) return -1;
          if (columnOne.position > columnTwo.position) return 1;
          return 0;
        }),
      };
    case boardActionTypes.BOARD_MEMBERS_RECEIVED:
      data = { ...action.data.data };
      return {
        ...state,
        members: data.members,
      };
    case columnActionTypes.COLUMN_CREATED:
      data = { ...action.data.data };
      return {
        ...state,
        columns: [...state.columns, data.column],
      };
    case cardActionTypes.CARD_CREATED:
      data = { ...action.data.data };

      return {
        ...state,
        cards: [...state.cards, data.card],
      };
    case cardActionTypes.CARD_DELETED:
      data = { ...action.data.data };
      cards = [...data.cards];

      return {
        ...state,
        cards: data.cards,
      };
    case columnActionTypes.COLUMN_POSITIONS_UPDATE_FAILED:
    case boardActionTypes.BOARD_UPDATE_FAILED:
    case cardActionTypes.CARD_DELETE_FAILED:
    case columnActionTypes.COLUMN_CREATE_FAILED:
    case columnActionTypes.COLUMN_DELETE_FAILED:
    default:
      return {
        ...state,
      };
  }
};

export default boardReducer;
