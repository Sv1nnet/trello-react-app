/* eslint-disable jsx-a11y/no-static-element-interactions */
// React/Redux components
import React, { useState, useRef, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Custom components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Droppable from '../utils/dragdrop/Droppable';
import CardContainer from '../cards/CardContainer';
import AddBoardContent from '../utils/AddBoardContent';
import MoveColumnPopup from './MoveColumnPopup';

// Context
import { BoardContentContext } from '../context/BoardContentContext';

// mapState and action
import { mapStateToProps } from '../../utlis/reduxMapFunction';
import boardActions from '../../actions/boardActions';

// Utils
import resizeTextarea from '../../utlis/resizeTextarea';


const propTypes = {
  dragHandleProps: PropTypes.shape({
    ref: PropTypes.shape({
      current: PropTypes.object,
    }).isRequired,
    onMouseDown: PropTypes.func.isRequired,
  }).isRequired,
  isDragging: PropTypes.bool.isRequired,
  columnData: PropTypes.shape({
    columnId: PropTypes.string.isRequired,
    listTitle: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      column: PropTypes.string.isRequired,
      comments: PropTypes.array.isRequired,
      labels: PropTypes.array.isRequired,
      position: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })),
  }).isRequired,
  token: PropTypes.shape({
    access: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  mouseDown: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  updateColumn: PropTypes.func.isRequired,
  createCard: PropTypes.func.isRequired,
  statusHook: PropTypes.shape({
    status: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      success: PropTypes.shape({
        statusCode: PropTypes.number,
        message: PropTypes.string,
      }).isRequired,
      err: PropTypes.shape({
        statusCode: PropTypes.number,
        message: PropTypes.string,
      }).isRequired,
    }).isRequired,
    setStatusLoading: PropTypes.func.isRequired,
    handleSuccess: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
  }).isRequired,
  refs: PropTypes.shape({
    titleInputRef: PropTypes.shape({
      current: PropTypes.object,
    }).isRequired,
    editingTargetRef: PropTypes.shape({
      current: PropTypes.object,
    }).isRequired,
  }).isRequired,
};


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
    statusHook,
    refs,
  } = props;

  const {
    setStatusLoading,
    handleSuccess,
    handleError,
  } = statusHook;

  const { columnId, listTitle, position, cards } = columnData;
  const { titleInputRef, editingTargetRef } = refs;

  const { moveColumn: updateColumnPosition } = useContext(BoardContentContext);

  const [titleState, setTitleState] = useState({ title: listTitle });
  const [moveColumnPopupIsActive, setMoveColumnPopupIsActive] = useState(false);

  const popupRelativeElementRef = useRef();

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

  const setTitleInputBlured = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      titleInputRef.current.blur();
    }
  };

  const deleteThisColumn = (e) => {
    e.preventDefault();

    deleteColumn(token.token, board._id, columnId)
      .catch(handleError);
  };

  const onTitleChange = (e) => {
    e.preventDefault();

    setTitleState({
      ...titleState,
      title: e.target.value,
    });

    resizeTextarea(titleInputRef);
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

  const onMouseDown = (e) => {
    mouseDown(e);
    dragHandleProps.onMouseDown(e);
  };

  const setMoveColumnPopupState = () => {
    setMoveColumnPopupIsActive(state => !state);
  };

  const moveColumn = (target) => {
    const source = {
      id: columnId,
      index: position,
    };

    setStatusLoading();

    updateColumnPosition(source, target)
      .then(handleSuccess)
      .catch(handleError);
  };

  const getPopupOffsetStyle = (relativeElement, offset = { top: 0, left: 0 }) => {
    const boundingClientRect = relativeElement.getBoundingClientRect();
    const top = offset.top || 0;
    const left = offset.left || 0;

    return {
      top: `${boundingClientRect.top + top}px`,
      left: '50%',
      transform: `translateX(calc(-50% + ${left}px))`,
    };
  };

  // Set textarea height and add ref to columnRefs on component did mount
  useEffect(() => {
    // Set title height corresponding its content
    resizeTextarea(titleInputRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${isDragging ? 'dragging' : ''} cards-list-container drag-source`}>
      <div ref={popupRelativeElementRef} className="list-header-container">
        <div
          onMouseDown={onMouseDown}
          ref={(el) => { editingTargetRef.current = el; dragHandleProps.ref.current = el; }}
          className="editing-target"
        />

        <textarea
          onBlur={updateTitle}
          onChange={onTitleChange}
          onKeyPress={setTitleInputBlured}
          ref={titleInputRef}
          maxLength="128"
          value={titleState.title}
        />

        <button className="list-menu-button" onClick={setMoveColumnPopupState} type="button">
          <FontAwesomeIcon className="ellipsis-btn" icon={faEllipsisH} />
        </button>

        {
          moveColumnPopupIsActive && (
            <MoveColumnPopup
              sourcePosition={position}
              sourceId={columnId}
              moveColumn={moveColumn}
              deleteColumn={deleteThisColumn}
              removeElement={setMoveColumnPopupState}
              style={getPopupOffsetStyle(popupRelativeElementRef.current, { offsetTop: 40 })}
            />
          )
        }
      </div>
      <Droppable droppableId={columnId} direction="vertical" type="card">
        {dropProvided => (
          <div {...dropProvided.droppableProps} ref={dropProvided.innerRef} className="cards-container">

            {cards.map((card, index) => (
              <CardContainer
                key={card._id}
                index={index}
                cardData={{
                  id: card._id,
                  title: card.title,
                  labels: card.labels,
                }}
                columnId={card.column}
              />
            ))}

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
          textInputType: 'textarea',
        }}
      />

    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  deleteColumn: (token, boardId, columnId) => dispatch(boardActions.deleteColumn(token, boardId, columnId)),
  updateColumn: (token, boardId, columnId, data) => dispatch(boardActions.updateColumn(token, boardId, columnId, data)),
  createCard: (token, boardId, card) => dispatch(boardActions.createCard(token, boardId, card)),
});


Column.propTypes = propTypes;


export default React.memo(connect(mapStateToProps.mapRequestData, mapDispatchToProps)(Column));
