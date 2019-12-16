/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Droppable } from 'react-beautiful-dnd';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import boardActions from '../../actions/boardActions';
import CardContainer from '../cards/CardContainer';
import AddBoardContent from '../utils/AddBoardContent';
import { ColumnListContext } from '../context/ColumnListContext';


const Column = (props) => {
  const {
    dragHandleProps,
    isDragging,
    columnData,
    token,
    board,
    mouseDown,
    deleteColumn,
    updateColumn,
    createCard,
    handleError,
    refs,
  } = props;

  const { columnId, listTitle, cards } = columnData;
  const { titleInputRef, editingTargetRef } = refs;

  const [titleState, setTitleState] = useState({
    title: listTitle,
  });

  const updateTitle = () => {
    const dataToUpdate = {
      title: titleState.title,
    };

    editingTargetRef.current.style.display = '';

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
    // Set textarea height 1px to recalculate its content height
    if (titleInputRef.current) {
      titleInputRef.current.style.height = '1px';

      const { scrollHeight } = titleInputRef.current;
      const newHeight = `${scrollHeight + 2}px`;

      titleInputRef.current.style.height = newHeight;
    }
  };

  const setTitleInputBlured = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      titleInputRef.current.blur();
    }
  };

  const deleteThisColumn = (e) => {
    e.preventDefault();

    if (e.nativeEvent.shiftKey) {
      deleteColumn(token.token, board._id, columnId)
        .catch(err => handleError(err));
    }
  };

  const handleTitleChange = (e) => {
    e.preventDefault();

    setTitleState({
      ...titleState,
      title: e.target.value,
    });

    resizeTitleTextarea();
  };

  const addCard = (e, cardTitle) => {
    e.preventDefault();

    if (!cardTitle) {
      const err = { status: 400, message: 'Card title can not be blank' };
      handleError(err);
      return Promise.reject(err);
    }

    const card = {
      title: cardTitle,
      column: columnId,
      position: cards.length,
    };

    return createCard(token.token, board._id, card)
      .catch((err) => {
        handleError(err);
        return Promise.reject(err);
      });
  };

  // Set textarea height and add ref to columnRefs on component did mount
  useEffect(() => {
    // Set title height corresponding its content
    resizeTitleTextarea();
  }, []);

  return (
    <div className={`${isDragging ? 'dragging' : ''} cards-list-container drag-source`}>
      <div className="list-header-container">
        <div
          onMouseDown={mouseDown}
          ref={(el) => { editingTargetRef.current = el; dragHandleProps.ref.current = el; }}
          className="editing-target"
        />

        <textarea
          onBlur={updateTitle}
          onChange={handleTitleChange}
          onKeyPress={setTitleInputBlured}
          ref={titleInputRef}
          maxLength="128"
          value={titleState.title}
        />

        <button className="list-menu-button" onClick={deleteThisColumn} type="button">
          <FontAwesomeIcon className="ellipsis-btn" icon={faEllipsisH} />
        </button>
      </div>
      <Droppable droppableId={columnId} type="task">
        {dropProvided => (
          <div data-droppable-id={columnId} {...dropProvided.droppableProps} ref={dropProvided.innerRef} className="cards-container">

            {cards.map((card, index) => (
              <CardContainer
                key={card._id}
                index={index}
                cardData={{
                  cardId: card._id,
                  cardPosition: card.position,
                  cardTitle: card.title,
                }}
                columnId={card.column}
              />
            ))}
            {dropProvided.placeholder}

          </div>
        )}
      </Droppable>

      <AddBoardContent
        addContent={addCard}
        openBtnTitle="Add another card"
        openBtnWrapperClass="create-card-button-wrapper"
        addBtnTitle="Add Card"
        containerClass="add-new-card-inputs-container"
        addBtnClass="add-card-btn"
        textInputOptions={{
          textInputName: 'cardTitle',
          textInputId: 'card-title',
          textInputClass: 'card-title-input',
          textInputPlaceholder: 'Card title...',
        }}
      />

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
  createCard: (token, boardId, card) => dispatch(boardActions.createCard(token, boardId, card)),
});

Column.propTypes = {

};

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(Column));
