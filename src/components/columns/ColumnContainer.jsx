import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import DraggableContainer from '../utils/DraggableContainer';
import isMouseMoved from '../../utlis/isMouseMoved';
import Column from './Column';
import '../../styles/cardsList.sass';


const defaultProps = {
  cards: [],
  columnRefs: [],
};

const propTypes = {
  cards: PropTypes.array,
  listTitle: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  columnRefs: PropTypes.array,
};


const ColumnContainer = (props) => {
  const columnDragTargetRef = useRef(null);
  const titleInputRef = useRef(null);
  const editingTargetRef = useRef(null);

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
    // Otherwise focus titleInputRef in order to change title.
    if (!isMouseMoved(e, mouseState.onMouseDownPosition, 5) && document.activeElement !== titleInputRef.current) {
      e.preventDefault();
      editingTargetRef.current.style.display = 'none';

      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  };

  const mouseDown = (e, { handleMouseUp, handleMouseMove }) => {
    if (document.activeElement !== titleInputRef.current) {
      e.preventDefault();

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    }
  };

  const mouseEnter = (e) => {
    switchColumns(e, {
      ...columnDragTargetRef,
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
      dragTargetRef={columnDragTargetRef}
      scrollOptions={scrollOptions}
      mouseEvents={{ mouseUp, mouseDown, mouseEnter }}
      elementRefs={columnRefs}
      action="UPDATE_COLUMNS"
    >
      <Column
        refs={{
          titleInputRef,
          editingTargetRef,
          tempColumnRefs,
          setColumnRefs,
          columnRefs,
        }}
        columnData={{
          columnId,
          listTitle,
          cards,
        }}
        handleError={handleError}
      />
    </DraggableContainer>
  );
};


ColumnContainer.defaultProps = defaultProps;
ColumnContainer.propTypes = propTypes;


export default ColumnContainer;
