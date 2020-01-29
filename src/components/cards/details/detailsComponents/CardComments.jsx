import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInput from '../../../utils/TextInput';
import boardActions from '../../../../actions/boardActions';
import isEnterPressed from '../../../../utlis/isEnterPressed';
import Comment from './Comment';


const CardComments = ({ comments, handleSuccess, handleError, board, token, addComment }) => {
  const [cardComment, setCardComment] = useState('');
  const [buttonsActive, setButtonsActive] = useState(false);

  const inputRef = useRef(null);

  const onFocus = () => {
    setButtonsActive(true);
  };

  const onCommentChange = (e) => {
    const { target } = e;
    setCardComment(target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    addComment(token.token, board._id, cardComment)
      .then(handleSuccess)
      .then(handleError);
  };

  const onBlur = (e) => {
    if (!e.target.value.match(/\S/)) setButtonsActive(false);
  };

  const blurOnShiftAndEnterPresse = (e) => {
    if (e.nativeEvent.shiftKey && isEnterPressed(e)) {
      e.preventDefault();
      e.target.blur();

      onSubmit(e);
    }
  };

  comments = [
    {
      text: 'first comment',
      author: 'Leonid Tsukanov',
      authorId: '5e1cae04b631d54bfc0c65dc',
      date: new Date(),
      _id: 0,
    },
    {
      text: 'second comment',
      author: 'Evan Bash',
      authorId: '5e1cae04b631d54bfc0c65de',
      date: new Date('12/12/2019'),
      _id: 1,
    },
    {
      text: 'third comment',
      author: 'Just Name',
      authorId: '5e1cae04b631d54bfc0c65dd',
      date: new Date('10/01/2019'),
      _id: 2,
    },
  ];

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
          <button onClick={onSubmit} type="button" className="bg-success text-white">Add</button>
        </div>
      </div>

      <ul className="card-details__comments-container">
        {comments.map(comment => (
          <Comment
            key={comment._id}
            text={comment.text}
            author={comment.author}
            date={comment.date}
            isOwner={comment.authorId === board.owner}
          />
        ))}
      </ul>
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  addComment: (token, boardId, comment) => dispatch(boardActions.addCardComment(token, boardId, comment)),
});


CardComments.propTypes = {

};


export default connect(mapStateToProps, mapDispatchToProps)(CardComments);
