import React, { useRef, useEffect } from 'react';
import DraggableContainer from '../utils/DraggableContainer';
import isMouseMoved from '../../utlis/isMouseMoved';
import Column from './Column';
import '../../styles/cardsList.sass';
import PropTypes from 'prop-types';


const propTypes = {
  cards: PropTypes.array,
  listTitle: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  columnRefs: PropTypes.array,

};


const ColumnContainer = (props) => {
  const columnDragTarget = useRef(null);
  const titleInput = useRef(null);
  const editingTarget = useRef(null);

  const {
    cards,
    listTitle,
    columnId,
    columnRefs,
    tempColumnRefs,
    setColumnRefs,
    handleError,
    switchColumns,
  } = props;

  // We need pass it to DraggableContainer to scroll it when cursore comes to edge of this element
  const boardColumnsContainer = document.querySelector('.board-lists-container');

  const mouseUp = (e, mouseState) => {
    // If user moves mouse more then 5 pixels across X or Y than drag column.
    // Otherwise focus titleInput in order to change title.
    if (!isMouseMoved(e, mouseState.onMouseDownPosition, 5) && document.activeElement !== titleInput.current) {
      e.preventDefault();
      editingTarget.current.style.display = 'none';

      titleInput.current.focus();
      titleInput.current.select();
    }
  };

  const mouseDown = (e, { handleMouseUp, handleMouseMove }) => {
    if (document.activeElement !== titleInput.current) {
      e.preventDefault();

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    }
  };

  const mouseEnter = (e) => {
    switchColumns(e, {
      ...columnDragTarget,
      _id: columnId,
    });
  };

  const scrollOptions = [
    {
      elementToScroll: boardColumnsContainer,
      distanceToStartScrollingX: 150,
      scrollStepX: 7,
      scrollX: true,
    },
  ];

  return (
    <DraggableContainer
      extraClasses="column-drag-area"
      dragTarget={columnDragTarget}
      scrollOptions={scrollOptions}
      mouseEvents={{ mouseUp, mouseDown, mouseEnter }}
      elementRefs={columnRefs}
    >
      <Column
        refs={{
          titleInput,
          editingTarget,
          tempColumnRefs,
          setColumnRefs,
          columnRefs,
        }}
        cards={cards}
        listTitle={listTitle}
        columnId={columnId}
        handleError={handleError}
        switchColumns={switchColumns}
      />
    </DraggableContainer>
  );
};


ColumnContainer.propTypes = {

};


export default ColumnContainer;
