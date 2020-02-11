import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BoardContentContext } from '../../../context/BoardContentContext';
import '../../../../styles/moveCardForm.sass';
import isOutOfViewport from '../../../../utlis/isOutOfViewport';


const propTypes = {
  sourceColumnId: PropTypes.string.isRequired,
  sourcePosition: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired,
  popupContainerRef: PropTypes.shape({
    current: PropTypes.instanceOf(HTMLElement),
  }).isRequired,
};


const MoveCardForm = (props) => {
  const {
    sourceColumnId,
    sourcePosition,
    moveCard,
    deleteCard,
    popupContainerRef,
  } = props;

  const { columnsWithCards } = useContext(BoardContentContext);
  const [position, setPosition] = useState(sourcePosition);
  const [columnToMove, setColumnToMove] = useState({
    ...columnsWithCards[sourceColumnId],
    id: sourceColumnId,
  });

  const columns = [];

  for (const column in columnsWithCards) {
    columns.push({
      id: column,
      title: columnsWithCards[column].title,
      position: columnsWithCards[column].position,
      cards: columnsWithCards[column].cards || [],
    });
  }

  columns.sort((columnOne, columnTwo) => {
    if (columnOne.position > columnTwo) return 1;
    if (columnOne.position < columnTwo) return -1;
    return 0;
  });

  const onColumnSelected = (e) => {
    const { target } = e;
    setColumnToMove({
      ...columnsWithCards[target.value],
      id: target.value,
    });
  };

  const onPositionSelected = (e) => {
    const { target } = e;
    setPosition(parseInt(target.value, 10));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const target = {
      containerId: columnToMove.id,
      index: position,
    };

    moveCard(target);
  };

  useEffect(() => {
    if (columnToMove.id === sourceColumnId) {
      setPosition(sourcePosition);
    }
  }, [columnToMove, sourceColumnId, sourcePosition]);

  useEffect(() => {
    setColumnToMove({
      ...columnsWithCards[sourceColumnId],
      id: sourceColumnId,
    });
  }, [columnsWithCards, sourceColumnId]);

  // If popup doesn't fit the screen then make it to fit
  useEffect(() => {
    const isOutResult = popupContainerRef.current ? isOutOfViewport(popupContainerRef.current) : {};

    if (isOutResult.right) {
      const windowWidth = window.innerWidth;
      const popupBoundingRect = popupContainerRef.current.getBoundingClientRect();
      const popupLeft = parseInt(popupContainerRef.current.style.left, 10);
      const updatedLeft = popupLeft - (popupBoundingRect.right - windowWidth);

      popupContainerRef.current.style.left = `${updatedLeft}px`;
    }
  }, [popupContainerRef]);

  return (
    <div className="move-card-popup__container">
      <span className="popup-title">Move Card</span>
      <form action="" onSubmit={onSubmit}>
        <span className="destination-popup-title">SELECT DESTINATION</span>

        <label className="move-card-popup__label-select-column" htmlFor="select-column">Column
          <br />
          <select defaultValue={columnToMove.id} onChange={onColumnSelected} name="select-column" id="select-column" className="move-card-form__select-column">
            {columns.map(column => (
              <option value={column.id} key={column.id}>{column.title}</option>
            ))}
          </select>
        </label>

        <label className="move-card-popup__label-select-position" htmlFor="select-position">Position
          <br />
          <select value={position} onChange={onPositionSelected} name="select-position" id="select-position" className="move-card-form__select-position">
            {columnToMove.cards.map((card, index) => (
              <option value={index} key={card._id}>{index + 1}</option>
            ))}
            {columnToMove.id !== sourceColumnId && (
              <option value={columnToMove.cards.length}>{columnToMove.cards.length + 1}</option>
            )}
          </select>
        </label>

        <button className="move-card-popup__submit-btn btn btn-primary" type="submit">Move</button>
        <button className="move-card-popup__delete-card-btn btn btn-danger" type="button" onClick={deleteCard}>Delete this card</button>
      </form>
    </div>
  );
};


MoveCardForm.propTypes = propTypes;


export default MoveCardForm;
