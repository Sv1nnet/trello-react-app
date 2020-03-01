import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../../../styles/comment.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faTimes } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../../../utils/TextInput';
import boardActions from '../../../../actions/boardActions';
import useStatus from '../../../../utlis/hooks/useStatus';
import Messages from '../../../utils/Messages';


const propTypes = {
  text: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  edited: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  isOwner: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  cardId: PropTypes.string.isRequired,
  userData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
  }).isRequired,
  updateCardComment: PropTypes.func.isRequired,
  deleteCardComment: PropTypes.func.isRequired,
};


const Comment = (props) => {
  const {
    text,
    author,
    authorId,
    edited,
    date,
    isOwner,
    id,
    cardId,
    userData,
    token,
    board,
    updateCardComment,
    deleteCardComment,
  } = props;

  const [comment, setComment] = useState(text);
  const [isInputActive, setInputActive] = useState(false);
  const [buttonsActive, setButtonsActive] = useState(false);
  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const inputRef = useRef(null);

  const [firstName, lastName] = author.split(' ');
  const initials = `${firstName[0]}${lastName[0]}`;

  const todayStr = new Date().toLocaleDateString();
  const activityDate = new Date(date);
  const activityDateStr = activityDate.toLocaleDateString();

  const onChange = (e) => {
    setComment(e.target.value);
  };

  const onFocus = () => {
    setButtonsActive(true);
    inputRef.current.focus();
    inputRef.current.value = '';
    inputRef.current.value = comment;
  };

  const switchInputState = () => {
    setInputActive(prevState => !prevState);
  };

  const discardCommentChanges = () => {
    setComment(text);
    switchInputState();
  };

  const updateComment = () => {
    setStatusLoading();

    updateCardComment(token.token, board._id, cardId, id, { text: comment })
      .then(handleSuccess)
      .then(() => {
        setInputActive(prevState => !prevState);
      })
      .catch(handleError);
  };

  const deleteComment = () => {
    deleteCardComment(token.token, board._id, cardId, id)
      .catch(handleError);
  };

  return (
    <>
      <li className="card-comment-container">
        <div className="card-comment__creator">
          {isOwner && (
            <div className="comment-creator__board-owner">
              <FontAwesomeIcon icon={faCrown} />
            </div>
          )}
          <div className="text-primary font-weight-bold text-center">
            {initials}
          </div>
        </div>

        <div className="card-comment__content">
          <div className="comment-content__author">
            <span>{author}</span>
          </div>

          <div className="comment-content__date">
            <span>{todayStr === activityDateStr ? activityDate.toLocaleTimeString() : activityDateStr}{edited ? ' (edited)' : ''}</span>
          </div>

          <div className="comment-content__comment-container">
            {isInputActive
              ? (
                <>
                  <TextInput
                    hideCrossBtn
                    hideSearchBtn
                    focusAfterActivated
                    inputValue={comment}
                    verticalPadding={2}
                    inputType="textarea"
                    innerRef={inputRef}
                    onChange={onChange}
                    onFocus={onFocus}
                    containerClassList="comment-content__edit-comment-container w-100"
                    classList="comment-content__edit-comment p-2"
                  />
                  <div className="card-details__comment-input-container">

                    <div className={`card-details__comment-button-container pt-0 ${buttonsActive ? 'active' : ''}`}>
                      <button onClick={updateComment} type="button" disabled={!comment.match(/\S/) || status.loading || comment === text} className="bg-success text-white">Save</button>
                      <button onMouseDown={discardCommentChanges} type="button" className="discard-btn">
                        <FontAwesomeIcon className="close-icon" icon={faTimes} />
                      </button>
                    </div>

                  </div>
                </>
              )
              : (
                <p className="comment-content__current-comment p-2">
                  {comment}
                </p>
              )}
          </div>

          {!isInputActive && (authorId === userData._id || userData._id === board.owner) && (
            <div className="comment-content__edit-buttons-container">
              <button type="button" className="buttons-container__edit-btn" onClick={switchInputState}>Edit</button>
              <button type="button" className="buttons-container__delete-btn" onClick={deleteComment}>Delete</button>
            </div>
          )}
        </div>
      </li>
      {status.err.message && ReactDOM.createPortal(
        <Messages.ErrorMessage message={status.err.message} closeMessage={resetStatus} btn />,
        document.body,
      )}
    </>
  );
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  updateCardComment: (token, boardId, cardId, commentId, data) => dispatch(boardActions.updateCardComment(token, boardId, cardId, commentId, data)),
  deleteCardComment: (token, boardId, cardId, commentId) => dispatch(boardActions.deleteCardComment(token, boardId, cardId, commentId)),
});


Comment.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(Comment);
