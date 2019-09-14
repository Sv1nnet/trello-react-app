/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import CardFace from '../cards/CardFace';
import boardActions from '../../actions/boardActions';
import CardListContext from '../context/CardListContext';


const Column = (props) => {
  const {
    cards,
    listTitle,
    columnId,
    token,
    board,
    handleMouseDown,
    deleteColumn,
    updateColumn,
    handleError,
    refs,
    refElementContainer,
    dragTarget,
  } = props;

  const {
    titleInput,
    editingTarget,
    tempColumnRefs,
    setColumnRefs,
    columnRefs,
  } = refs;

  const [titleState, setTitleState] = useState({
    title: listTitle,
  });
  const [cardRefs, setCardRefs] = useState([]);

  const updateTitle = () => {
    const dataToUpdate = {
      title: titleState.title,
    };

    editingTarget.current.style.display = '';

    if (listTitle !== titleState.title) {
      updateColumn(token.token, board._id, columnId, dataToUpdate)
        .catch((err) => {
          setTitleState({
            ...titleState,
            title: listTitle,
          });
          handleError(err);
        });
    }
  };

  const resizeTitleTextarea = () => {
    // Set textarea height 1px to recalculate it's content height
    if (titleInput.current) {
      titleInput.current.style.height = '1px';

      const { scrollHeight } = titleInput.current;
      const newHeight = `${scrollHeight + 2}px`;

      titleInput.current.style.height = newHeight;
    }
  };

  const setTitleInputBlured = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      titleInput.current.blur();
    }
  };

  const deleteThisColumn = (e) => {
    e.preventDefault();

    deleteColumn(token.token, board._id, columnId)
      .then(() => {
        // Update columnRefs
        const newRefs = columnRefs.filter(ref => ref.current !== dragTarget.current);
        setColumnRefs([...newRefs]);
      })
      .catch(err => handleError(err));
  };

  const handleTitleChange = (e) => {
    e.preventDefault();

    setTitleState({
      ...titleState,
      title: e.target.value,
    });

    resizeTitleTextarea();
  };

  // Set textarea height and add ref to columnRefs on component did mount
  useEffect(() => {
    // Set title height corresponding its content
    resizeTitleTextarea();

    // Add ref to columnRefs in board component
    tempColumnRefs.push({
      ...dragTarget,
      _id: columnId,
    });

    setColumnRefs([...tempColumnRefs]);
  }, []);

  const sortedCards = cards.sort((cardOne, cardTwo) => {
    if (cardOne.position < cardTwo.position) return -1;
    if (cardOne.position > cardTwo.position) return 1;
    return 0;
  });

  return (
    <div
      ref={refElementContainer}
      className="cards-list-container drag-source"
    >
      <div className="list-header-container">
        <div
          onMouseDown={handleMouseDown}
          ref={editingTarget}
          className="editing-target"
        />

        <textarea
          onBlur={updateTitle}
          onChange={handleTitleChange}
          onKeyPress={setTitleInputBlured}
          ref={titleInput}
          maxLength="128"
          value={titleState.title}
        />

        <button className="list-menu-button" onClick={deleteThisColumn} type="button">
          <FontAwesomeIcon className="ellipsis-btn" icon={faEllipsisH} />
        </button>
      </div>
      <div className="cards-container">

        {sortedCards.map((card, i) => (
          <CardFace
            key={card._id}
            cardId={card._id}
            cardPosition={i}
            cardTitle={card.title}
            setCardRefs={setCardRefs}
          />
        ))}

        <textarea
          onChange={handleTitleChange}
          onKeyPress={setTitleInputBlured}
          onBlur={updateTitle}
          onMouseDown={handleMouseDown}
          maxLength="128"
          className="add-card"
          value=""
          placeholder="Enter a title of this card"
          hidden
        />

      </div>
      <div className="create-card-button-wrapper my-1 mx-1">
        <a href="/" className="btn btn-sm btn-block">
          <FontAwesomeIcon className="add-icon" icon={faPlus} />
          <span>Add another card</span>
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  deleteColumn: (token, boardId, columnId) => dispatch(boardActions.deleteColumn(token, boardId, columnId)),
  updateColumn: (token, boardId, columnId, data) => dispatch(boardActions.updateColumn(token, boardId, columnId, data)),
});

Column.propTypes = {

};


export default connect(mapStateToProps, mapDispatchToProps)(Column);
