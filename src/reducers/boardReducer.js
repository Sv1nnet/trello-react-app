import { boardActionTypes } from '../types';


const initialState = {
  _id: 'uyjhjhasdufhudsayufdsahfs',
  title: 'Board title',
  owner: 'ldkafsdpjfklsjdfksdk',
  history: [],
  description: 'Some description here',
  isPrivate: true,
  marks: [
    {
      color: 'yellow',
      title: 'My yellow mark',
      id: '4893284023u4ej890jfoijfwe0',
    },
    {
      color: 'green',
      title: 'My green mark',
      id: '4893284023uasdasd0jfoijfwe0',
    },
    {
      color: 'red',
      title: 'My red mark',
      id: '48932840234645t90jfoijfwe0',
    },
  ],
  chat: 'gdfgfhgfjhjdghfghf',
  cards: [
    // {
    //   _id: '1230',
    //   column: 'qweqweqweqwe',
    //   position: 1,
    //   title: 'Card two',
    // },
    // {
    //   _id: '1231',
    //   column: 'qweqweqweqwe',
    //   position: 0,
    //   title: 'Card one',
    // },
    // {
    //   _id: '1232',
    //   column: 'qweqweqweqwe',
    //   position: 3,
    //   title: 'Card four',
    // },
    // {
    //   _id: '1233',
    //   column: 'qweqweqweqwe',
    //   position: 2,
    //   title: 'Card three',
    // },
    // {
    //   _id: '1234',
    //   column: 'ewqewqewqewq',
    //   position: 0,
    //   title: 'Card one',
    // },
    // {
    //   _id: '1235',
    //   column: 'ewqewqewqewq',
    //   position: 1,
    //   title: 'Card two',
    // },
    // {
    //   _id: '1236',
    //   column: 'qweewqqweewq',
    //   position: 0,
    //   title: 'Card three',
    // },
    // {
    //   _id: '1237',
    //   column: 'qweewqqweewq',
    //   position: 2,
    //   title: 'Card one',
    // },
    // {
    //   _id: '1238',
    //   column: 'qweewqqweewq',
    //   position: 1,
    //   title: 'Card two',
    // },
  ],
  members: [
    // {
    //   _id: 'kdsjafklasjdklfjsdlfsd',
    //   email: 'one@member.com',
    //   nickname: 'MemberOne',
    // },
    // {
    //   _id: 'kdsjafklasjdsafjsdlfsd',
    //   email: 'two@member.com',
    //   nickname: 'MemberTwo',
    // },
    // {
    //   _id: 'kdsjafkdajdklfjsdlfsd',
    //   email: 'three@member.com',
    //   nickname: 'MemberThree',
    // },
    // {
    //   _id: 'kdsjgfklasjdklfjsdlfsd',
    //   email: 'for@member.com',
    //   nickname: 'MemberFor',
    // },
    // {
    //   _id: 'kdsjafkasasjdklfjsdlfsd',
    //   email: 'five@member.com',
    //   nickname: 'MemberFive',
    // },
    // {
    //   _id: 'kdsjafkfddjdklfjsdlfsd',
    //   email: 'six@member.com',
    //   nickname: 'MemberSix',
    // },
    // {
    //   _id: 'kdsjafklasjdklfjaslfsd',
    //   email: 'seven@member.com',
    //   nickname: 'MemberSeven',
    // },
  ],
  isReadOnly: false,
  columns: [
    // {
    //   _id: 'qweqweqweqwe',
    //   title: 'List two',
    //   position: 1,
    // },
    // {
    //   _id: 'ewqewqewqewq',
    //   title: 'List one',
    //   position: 0,
    // },
    // {
    //   _id: 'qweewqqweewq',
    //   title: 'List three',
    //   position: 2,
    // },
  ],
};
// const initialState = {
//   id: '',
//   title: '',
//   owner: '',
//   history: [],
//   description: '',
//   isPrivate: true,
//   marks: [],
//   chat: '',
//   cards: [],
//   members: [],
//   isReadOnly: true,
//   columns: [],
// };

const boardReducer = (state = initialState, action) => {
  let data;
  switch (action.type) {
    case boardActionTypes.CREATED:
      data = { ...action.data.data };
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
        columns: data.columns,
      };
    case boardActionTypes.BOARD_UPDATED:
    case boardActionTypes.BOARD_DOWNLOADED:
      data = { ...action.data.data };
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
        columns: data.columns,
      };
    case boardActionTypes.BOARD_MEMBER_ADDED:
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
        columns: data.board.columns,
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
        columns: data.board.columns,
      };
    case boardActionTypes.BOARD_MEMBERS_RECEIVED:
      data = { ...action.data.data };
      return {
        ...state,
        members: data.members,
      };
    case boardActionTypes.BOARD_UPDATE_FAILED:
    default:
      return { ...state };
  }
};

export default boardReducer;
