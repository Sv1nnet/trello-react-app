// React/Redux components
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Custom components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Messages from '../utils/Messages';

// Custom hooks
import useStatus from '../../utlis/hooks/useStatus';

// mapState and actions
import { mapStateToProps } from '../../utlis/reduxMapFunction';
import boardActions from '../../actions/boardActions';

// Styles
import '../../styles/boardListItem.sass';


const propTypes = {
  id: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  events: PropTypes.shape({
    onClick: PropTypes.func,
  }),
};

const defaultProps = {
  events: {},
};

// User can either delete a board from database or remove it from his board list (if he is not the board owner).
// So we have 2 types of actions of delete/remove button and we can get them from the object below.
const boardDeleteOptions = {
  owner: {
    getRequestMessage: title => `Delete "${title}" board?`,
    action: 'deleteBoard',
    getPostActionHandler: (id, board) => (res) => {
      if (window.location.pathname !== '/board/all' && id === board._id) window.location.replace(`${window.location.origin}/board/all`);
      return res;
    },
  },
  member: {
    getRequestMessage: title => `Stop being "${title}" board member?`,
    action: 'removeBoard',
    getPostActionHandler: () => (res) => {
      if (res.data.board.isPrivate) window.location.replace(`${window.location.origin}/board/all`);
      return res;
    },
  },
};


const BoardListItem = (props) => {
  const {
    id,
    owner,
    title,
    events,
    board,
    token,
    userData,
  } = props;

  const {
    status,
    setStatusLoading,
    resetStatus,
    handleError,
  } = useStatus();

  const [questionIsActive, setQuestionIsActive] = useState(false);

  const url = `/board/${id}`;

  const isOwner = userData._id === owner;
  const { getRequestMessage, action, getPostActionHandler } = isOwner ? boardDeleteOptions.owner : boardDeleteOptions.member;
  const postActionHandler = getPostActionHandler(id, board);

  const deleteBoard = () => {
    setQuestionIsActive(true);
  };

  const positiveAnswer = () => {
    const boardAction = props[action];

    setStatusLoading();

    boardAction(token.token, id)
      .then(postActionHandler)
      .catch((err) => {
        handleError(err);
        setQuestionIsActive(false);
      });
  };

  const negativeAnswer = () => {
    setQuestionIsActive(false);
  };

  return (
    <>
      <div className="col-12 px-0 dropdown-board-list-item pt-2">
        <div className="board-list-item-container">
          <Link to={url} {...events} className="pl-3 pr-5 w-100 d-block text-decoration-none text-center font-weight-bold">{title}</Link>

          <button onClick={deleteBoard} type="button" className="delete-board-btn">
            <FontAwesomeIcon className="delete-icon" icon={faTrashAlt} />
          </button>
        </div>
      </div>

      {questionIsActive && ReactDOM.createPortal(
        <Messages.QuestionMessage type="error" message={getRequestMessage(title)} answer={{ positive: positiveAnswer, negative: negativeAnswer }} />,
        document.body,
      )}

      {status.err.message && ReactDOM.createPortal(
        <Messages.ErrorMessage message={status.err.message} closeMessage={resetStatus} btn />,
        document.body,
      )}
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  deleteBoard: (token, boardId) => dispatch(boardActions.deleteBoard(token, boardId)),
  removeBoard: (token, boardId) => dispatch(boardActions.removeBoard(token, boardId)),
});


BoardListItem.propTypes = propTypes;
BoardListItem.defaultProps = defaultProps;


export default connect(mapStateToProps.mapFullUserData, mapDispatchToProps)(BoardListItem);
