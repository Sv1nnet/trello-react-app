// React/Redux components
import React from 'react';
import PropTypes from 'prop-types';

// Custom components
import PopupContainer from '../../../utils/PopupContainer';
import BoardListItem from '../../../boards/BoardListItem';

// Styles
import '../../../../styles/boardListPopup.sass';


const propTypes = {
  boards: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  openCreateBoard: PropTypes.func.isRequired,
  onPopupBtnClick: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
  }).isRequired,
};


const BoardListPopup = (props) => {
  const {
    boards,
    openCreateBoard,
    onPopupBtnClick,
    userData,
  } = props;
  const { email, nickname } = userData;

  return (
    <PopupContainer popupToClose="boardsPopupActive" classesToNotClosePopup={['dropdown-boards', 'boards-title', 'message-container', 'message', 'btn']} extraClasses={['dropdown-boards']} removeElement={onPopupBtnClick} userData={{ email, nickname }}>
      <div className="w-100">
        <h5 className="mt-2 w-100 text-secondary text-center">Boards</h5>

        <div className="boards-container">
          <ul className="pl-0 board-list-container list-group">
            {boards.map(board => <BoardListItem key={board._id} id={board._id} owner={board.owner} title={board.title} events={{ onClick: e => onPopupBtnClick(e, 'boardsPopupActive') }} />)}
          </ul>
        </div>

        <div className="col-12 px-0 text-center pt-2">
          <a onClick={openCreateBoard} href="/">Create a new board</a>
        </div>
      </div>
    </PopupContainer>
  );
};


BoardListPopup.propTypes = propTypes;


export default BoardListPopup;
