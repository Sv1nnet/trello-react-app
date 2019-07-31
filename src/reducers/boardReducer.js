import { boardActionTypes } from '../types';


// const initialState = {
//   id: 'uyjhjhasdufhudsayufdsahfs',
//   owner: 'ldkafsdpjfklsjdfksdk',
//   history: [],
//   description: 'Some description here',
//   private: true,
//   marks: [
//     {
//       color: 'yellow',
//       title: 'My yellow mark',
//       id: '4893284023u4ej890jfoijfwe0',
//     },
//     {
//       color: 'green',
//       title: 'My green mark',
//       id: '4893284023uasdasd0jfoijfwe0',
//     },
//     {
//       color: 'red',
//       title: 'My red mark',
//       id: '48932840234645t90jfoijfwe0',
//     },
//   ],
//   chat: 'gdfgfhgfjhjdghfghf',
//   cards: [],
//   members: ['uyjhjhasdufhudsayufdsahfs'],
//   readOnly: true,
//   columns: [],
// };
const initialState = {
  id: '',
  owner: '',
  history: [],
  description: '',
  private: undefined,
  marks: [],
  chat: '',
  cards: [],
  members: [],
  readOnly: undefined,
  columns: [],
};

const boardReducer = (state = initialState, action) => {
  let data;
  switch (action.type) {
    case boardActionTypes.ALL_BOARDS_DOWNLOADED:
      return {
        ...state,
      };
    case boardActionTypes.CREATED:
      data = { ...action.data.data };
      return {
        id: data.id,
        owner: data.owner,
        history: [],
        description: '',
        private: undefined,
        marks: [],
        cards: [],
        members: [],
        readOnly: true,
        columns: [],
      };
    default:
      return { ...state };
  }
};

export default boardReducer;
