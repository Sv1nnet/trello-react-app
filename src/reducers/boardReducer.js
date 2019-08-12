/* eslint-disable no-underscore-dangle */
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
  cards: [],
  members: [
    {
      _id: 'kdsjafklasjdklfjsdlfsd',
      email: 'one@member.com',
      nickname: 'MemberOne',
    },
    {
      _id: 'kdsjafklasjdsafjsdlfsd',
      email: 'two@member.com',
      nickname: 'MemberTwo',
    },
    {
      _id: 'kdsjafkdajdklfjsdlfsd',
      email: 'three@member.com',
      nickname: 'MemberThree',
    },
    {
      _id: 'kdsjgfklasjdklfjsdlfsd',
      email: 'for@member.com',
      nickname: 'MemberFor',
    },
    {
      _id: 'kdsjafkasasjdklfjsdlfsd',
      email: 'five@member.com',
      nickname: 'MemberFive',
    },
    {
      _id: 'kdsjafkfddjdklfjsdlfsd',
      email: 'six@member.com',
      nickname: 'MemberSix',
    },
    {
      _id: 'kdsjafklasjdklfjaslfsd',
      email: 'seven@member.com',
      nickname: 'MemberSeven',
    },
  ],
  isReadOnly: false,
  columns: [],
};
// const initialState = {
//   id: '',
//   title: '',
//   owner: '',
//   history: [],
//   description: '',
//   isPrivate: undefined,
//   marks: [],
//   chat: '',
//   cards: [],
//   members: [],
//   isReadOnly: undefined,
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
        isPrivate: undefined,
        marks: data.marks,
        cards: data.cards,
        members: data.members,
        isReadOnly: true,
        columns: data.columns,
      };
    default:
      return { ...state };
  }
};

export default boardReducer;
