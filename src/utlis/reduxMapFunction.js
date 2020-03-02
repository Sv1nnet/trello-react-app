const mapFullUserData = state => ({
  userData: state.user.userData,
  token: state.user.token,
  board: state.board,
});

const mapRequestData = state => ({
  token: state.user.token,
  board: state.board,
});

const mapBoardAndUser = state => ({
  user: state.user,
  board: state.board,
});

const mapUserIdAndToken = state => ({
  userId: state.user.userData._id,
  token: state.user.token,
});

const mapBoardsAndToken = state => ({
  boards: state.user.userData.boards,
  token: state.user.token.token,
});

const mapToken = state => ({
  token: state.user.token,
});

const mapBoard = state => ({
  board: state.board,
});


export const mapStateToProps = {
  mapFullUserData,
  mapRequestData,
  mapBoardAndUser,
  mapUserIdAndToken,
  mapBoardsAndToken,
  mapToken,
  mapBoard,
};
