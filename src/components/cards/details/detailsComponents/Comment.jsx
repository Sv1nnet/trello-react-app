import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../../../../styles/comment.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../../../utils/TextInput';


const Comment = (props) => {
  const {
    text,
    author,
    date,
    isOwner,
    id,
    cardId,
  } = props;

  const [comment, setComment] = useState(text);
  const [isInputActive, setInputActive] = useState(false);

  const inputRef = useRef(null);

  const [firstName, lastName] = author.split(' ');
  const initials = `${firstName[0]}${lastName[0]}`;

  const todayStr = new Date().toLocaleDateString();
  const activityDate = new Date(date);
  const activityDateStr = activityDate.toLocaleDateString();

  const onChange = (e) => {
    setComment(e.target.value);
  };

  const focusInput = () => {
    setInputActive(true);
    // inputRef.current.focus();
    // inputRef.current.value = '';
    // inputRef.current.value = comment;
  };

  return (
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
          <span>{todayStr === activityDateStr ? activityDate.toLocaleTimeString() : activityDateStr}</span>
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
                  containerClassList="comment-content__edit-comment-container w-100"
                  classList="comment-content__edit-comment p-2"
                />
              </>
            )
            : (
              <p className="comment-content__current-comment p-2">
                {comment}
              </p>
            )}
        </div>

        <div className="comment-content__edit-buttons-container">
          <button type="button" className="buttons-container__edit-btn" onClick={focusInput}>Edit</button>
          <button type="button" className="buttons-container__delete-btn" onClick={() => { }}>Delete</button>
        </div>
      </div>
    </li>
  );
};


Comment.propTypes = {

};


export default Comment;
