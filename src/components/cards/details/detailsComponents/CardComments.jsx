import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInput from '../../../utils/TextInput';
import boardActions from '../../../../actions/boardActions';
import isEnterPressed from '../../../../utlis/isEnterPressed';
import Comment from './Comment';
import useStatus from '../../../../utlis/hooks/useStatus';
import Messages from '../../../utils/Messages';


const propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    edited: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired,
  })),
  userData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
  }).isRequired,
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  cardId: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired,
};

const defaultProps = {
  comments: [],
};


const CardComments = (props) => {
  const {
    comments,
    userData,
    board,
    token,
    cardId,
    addComment,
  } = props;

  const [cardComment, setCardComment] = useState('');
  const [buttonsActive, setButtonsActive] = useState(false);
  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const inputRef = useRef(null);

  const onFocus = () => {
    setButtonsActive(true);
  };

  const onCommentChange = (e) => {
    const { target } = e;
    setCardComment(target.value);
  };

  const sendComment = (e) => {
    e.preventDefault();

    const data = {
      authorId: userData._id,
      date: new Date().toUTCString(),
      text: cardComment,
    };

    setStatusLoading();

    addComment(token.token, board._id, cardId, data)
      .then(handleSuccess)
      .then(() => {
        setButtonsActive(false);
        setCardComment('');
      })
      .catch(handleError);
  };

  const onBlur = (e) => {
    if (!e.target.value.match(/\S/)) setButtonsActive(false);
  };

  const blurOnShiftAndEnterPresse = (e) => {
    if (e.nativeEvent.shiftKey && isEnterPressed(e)) {
      e.preventDefault();
      e.target.blur();

      sendComment(e);
    }
  };

  return (
    <>
      <div className="card-details__comments-wrap">
        <span className="font-weight-bold">COMMENTS</span>

        <div className="card-details__comment-input-container">
          <TextInput
            hideSearchBtn
            hideCrossBtn
            inputType="textarea"
            name="card-comment"
            innerRef={inputRef}
            inputValue={cardComment}
            onBlur={onBlur}
            onFocus={onFocus}
            onChange={onCommentChange}
            onKeyPress={blurOnShiftAndEnterPresse}
            classList="w-100 py-2 card-details__comment-input"
            placeholder="Write a comment..."
          />

          <div className={`card-details__comment-button-container ${buttonsActive ? 'active' : ''}`}>
            <button onClick={sendComment} type="button" disabled={!cardComment.match(/\S/) || status.loading} className="bg-success text-white">Add</button>
          </div>
        </div>

        <ul className="card-details__comments-container">
          {comments.map(comment => (
            <Comment
              key={comment._id}
              id={comment._id}
              text={comment.text}
              cardId={cardId}
              author={comment.authorName}
              authorId={comment.authorId}
              edited={comment.edited}
              date={comment.date}
              isOwner={comment.authorId === board.owner}
            />
          ))}
        </ul>
      </div>
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
  addComment: (token, boardId, cardId, comment) => dispatch(boardActions.addCardComment(token, boardId, cardId, comment)),
});


CardComments.propTypes = propTypes;
CardComments.defaultProps = defaultProps;


export default connect(mapStateToProps, mapDispatchToProps)(CardComments);
