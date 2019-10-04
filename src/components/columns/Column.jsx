/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import boardActions from '../../actions/boardActions';
import CardContainer from '../cards/CardContainer';
import AddBoardContent from '../utils/AddBoardContent';


const Column = (props) => {
  const {
    columnData,
    token,
    board,
    handleMouseDown,
    deleteColumn,
    updateColumn,
    createCard,
    handleError,
    refs,
    columnRefsAPI,
    cardRefsAPI,
    switchCards,
    elementContainerRef,
  } = props;

  const {
    titleInputRef,
    editingTargetRef,
    dragTargetRef,
  } = refs;

  const { columnRefs, tempColumnRefs = [], setColumnRefs } = columnRefsAPI;
  const { columnId, listTitle, cards } = columnData;

  const [titleState, setTitleState] = useState({
    title: listTitle,
  });

  const cardsContainerRef = useRef(null);

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
    // Set textarea height 1px to recalculate it's content height
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
        .then(() => {
          // Update columnRefs
          const newRefs = columnRefs.filter(columnRef => columnRef._id !== columnId);
          setColumnRefs([...newRefs]);
        })
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

  // const switchCards = () => {};

  // Set textarea height and add ref to columnRefs on component did mount
  useEffect(() => {
    // Set title height corresponding its content
    resizeTitleTextarea();

    // // Add ref to columnRefs in board component
    tempColumnRefs.push({
      ...dragTargetRef,
      _id: columnId,
    });

    // Need to spread columnRef as well in case user adds a new column (after board loaded)
    setColumnRefs([...columnRefs, ...tempColumnRefs]);
  }, []);

  const sortedCards = cards.sort((cardOne, cardTwo) => {
    if (cardOne.position < cardTwo.position) return -1;
    if (cardOne.position > cardTwo.position) return 1;
    return 0;
  });

  const cardContainers = sortedCards.map((card, i) => (
    <CardContainer
      key={card._id}
      cardData={{
        cardId: card._id,
        cardPosition: i,
        cardTitle: card.title,
      }}
      columnId={columnId}
      refs={{
        columnRefs,
      }}
      cardRefsAPI={{
        ...cardRefsAPI,
        cardsContainerRef,
      }}
      switchCards={switchCards}
    />
  ));

  return (
    <div
      ref={elementContainerRef}
      className="cards-list-container drag-source"
    >
      <div className="list-header-container">
        <div
          onMouseDown={handleMouseDown}
          ref={editingTargetRef}
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
      <div ref={cardsContainerRef} className="cards-container">

        {cardContainers}

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


export default connect(mapStateToProps, mapDispatchToProps)(Column);
