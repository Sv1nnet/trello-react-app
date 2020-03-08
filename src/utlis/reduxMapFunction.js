/**
 * Pass data to React component props from Redux state
 * @param {object} state Redux state object
 * @return {object} { userData: state.user.userData, token: state.user.token, board: state.board }
 */
const mapFullUserData = state => ({
  userData: state.user.userData,
  token: state.user.token,
  board: state.board,
});

/**
 * Pass data to React component props from Redux state
 * @param {object} state Redux state object
 * @return {object} { token: state.user.token, board: state.board }
 */
const mapRequestData = state => ({
  token: state.user.token,
  board: state.board,
});

/**
 * Pass data to React component props from Redux state
 * @param {object} state Redux state object
 * @return {object} { user: state.user, board: state.board }
 */
const mapBoardAndUser = state => ({
  user: state.user,
  board: state.board,
});

/**
 * Pass data to React component props from Redux state
 * @param {object} state Redux state object
 * @return {object} { userId: state.userData._id, token: state.user.token }
 */
const mapUserIdAndToken = state => ({
  userId: state.user.userData._id,
  token: state.user.token,
});

/**
 * Pass data to React component props from Redux state
 * @param {object} state Redux state object
 * @return {object} { board: state.user.userData.boards, token: state.user.token }
 */
const mapBoardsAndToken = state => ({
  boards: state.user.userData.boards,
  token: state.user.token.token,
});

/**
 * Pass data to React component props from Redux state
 * @param {object} state Redux state object
 * @return {object} { token: state.user.token }
 */
const mapToken = state => ({
  token: state.user.token,
});

/**
 * Pass data to React component props from Redux state
 * @param {object} state Redux state object
 * @return {object} { board: state.board }
 */
const mapBoard = state => ({
  board: state.board,
});


// eslint-disable-next-line import/prefer-default-export
export const mapStateToProps = {
  mapFullUserData,
  mapRequestData,
  mapBoardAndUser,
  mapUserIdAndToken,
  mapBoardsAndToken,
  mapToken,
  mapBoard,
};
