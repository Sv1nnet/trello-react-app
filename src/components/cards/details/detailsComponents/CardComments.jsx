import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInput from '../../../utils/TextInput';
import boardActions from '../../../../actions/boardActions';
import isEnterPressed from '../../../../utlis/isEnterPressed';
import Comment from './Comment';


const CardComments = ({ comments, userData, board, token, cardId, addComment }) => {
  const [cardComment, setCardComment] = useState('');
  const [buttonsActive, setButtonsActive] = useState(false);
  const [status, setStatus] = useState({
    loading: false,
    err: {
      statusCode: null,
      message: null,
    },
    success: {
      statusCode: null,
      message: null,
      data: null,
    },
  });

  const handleSuccess = (res) => {
    setStatus({
      loading: false,
      err: {
        statusCode: null,
        message: null,
      },
      success: {
        statusCode: res.status,
        message: res.data.message,
        data: res.data,
      },
    });
  };

  const handleError = (err) => {
    setStatus({
      loading: false,
      err: {
        statusCode: err.status,
        message: err.message,
      },
      success: {
        statusCode: null,
        message: null,
        data: null,
      },
    });
  };

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

    setStatus(prevStatus => ({ ...prevStatus, loading: true }));

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
            text={comment.text}
            author={comment.authorName}
            date={comment.date}
            isOwner={comment.authorId === board.owner}
          />
        ))}
      </ul>
    </div>
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


CardComments.propTypes = {

};


export default connect(mapStateToProps, mapDispatchToProps)(CardComments);
