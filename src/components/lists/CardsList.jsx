/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import '../../styles/cardsList.sass';
import CardFace from '../cards/CardFace';
import boardActions from '../../actions/boardActions';
import dragElement from '../../utlis/dragElement';


const propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  token: PropTypes.shape({
    access: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    members: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    cards: PropTypes.array.isRequired,
  }).isRequired,
  listTitle: PropTypes.string.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  updateColumn: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
};


const CardsList = (props) => {
  const {
    cards,
    listTitle,
    columnId,
    token,
    board,
    deleteColumn,
    updateColumn,
    handleError,
  } = props;

  const titleInput = useRef(null);
  const editingTarget = useRef(null);
  const columnContainer = useRef(null);
  const columnDragArea = useRef(null);

  const [titleState, setTitleState] = useState({
    title: listTitle,
  });

  const mouseState = {
    mouseDown: false,
    currentPosition: {
      x: undefined,
      y: undefined,
    },
  };

  const columnState = {
    dragging: false,
  };

  const sortedCards = cards.sort((cardOne, cardTwo) => {
    if (cardOne.position < cardTwo.position) return -1;
    if (cardOne.position > cardTwo.position) return 1;
    return 0;
  });

  /**
   * Detect if mouse was moved after mousedown event occured
   * @param e {Event} ReactEvent objecr or nativeEvent object
   * @param difference {Number} distance that mouse have to be moved to be considered as moved
   */
  const isMouseMoved = (e, difference = 0) => {
    const event = e.nativeEvent || e;

    const currentX = event.x;
    const currentY = event.y;

    const stateX = mouseState.currentPosition.x;
    const stateY = mouseState.currentPosition.y;

    const isXDifferent = Math.abs(stateX - currentX) > difference;
    const isYDifferent = Math.abs(stateY - currentY) > difference;

    return isXDifferent || isYDifferent;
  };

  const handleMouseMove = (e) => {
    if (!columnState.dragging && isMouseMoved(e, 5)) {
      columnState.dragging = true;
      columnDragArea.current.classList.add('dragging');

      dragElement(e, columnContainer.current);
    }
  };

  const handleMouseUp = (e) => {
    if (columnState.dragging && mouseState.mouseDown) {
      columnState.dragging = false;
    }

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);

    columnDragArea.current.classList.remove('dragging');

    columnDragArea.current.appendChild(columnContainer.current);

    // If user moves mouse more then 5 pixels across X or Y than drag column.
    // Otherwise focus titleInput in order to change title
    if (!isMouseMoved(e, 5) && document.activeElement !== titleInput.current) {
      e.preventDefault();
      editingTarget.current.style.display = 'none';

      titleInput.current.focus();
      titleInput.current.select();
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;

    mouseState.mouseDown = true;
    mouseState.currentPosition.x = e.nativeEvent.x;
    mouseState.currentPosition.y = e.nativeEvent.y;

    if (document.activeElement !== titleInput.current) {
      e.preventDefault();

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
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

  // Once titleInput blured it invokes updateTitle, so we just blur titleInput if Enter pressed
  const setTitleInputBlured = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      titleInput.current.blur();
    }
  };

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

  const deleteThisColumn = (e) => {
    e.preventDefault();

    deleteColumn(token.token, board._id, columnId)
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

  useEffect(() => {
    resizeTitleTextarea();
  }, []);

  return (
    <div ref={columnDragArea} className="column-drag-area drag-target">
      <div
        ref={columnContainer}
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

          {sortedCards.map(card => <CardFace key={card._id} cardTitle={card.title} />)}

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


CardsList.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(CardsList);
