import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import Draggable from '../utils/dragdrop/Draggable';
import isMouseMoved from '../../utlis/isMouseMoved';
import Column from './Column';
import '../../styles/cardsList.sass';
import { ColumnListContext } from '../context/ColumnListContext';


const propTypes = {
  boardId: PropTypes.string.isRequired,
  listTitle: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  handleError: PropTypes.func.isRequired,
};


const ColumnContainer = (props) => {
  const titleInputRef = useRef(null);
  const editingTargetRef = useRef(null);

  const {
    boardId,
    listTitle,
    columnId,
    index,
    position,
    handleError,
  } = props;

  const { columnsWithCards } = useContext(ColumnListContext);
  const mouseState = {
    onMouseDownPosition: {
      x: null,
      y: null,
    },
    mouseMoved: false,
  };

  const mouseUp = (e) => {
    // If user moves mouse more then 5 pixels across X or Y than drag column.
    // Otherwise focus titleInputRef in order to change title.
    if (!isMouseMoved(e, mouseState.onMouseDownPosition, 5) && document.activeElement !== titleInputRef.current) {
      e.preventDefault();
      editingTargetRef.current.style.display = 'none';

      titleInputRef.current.focus();
      titleInputRef.current.select();
    }

    mouseState.onMouseDownPosition.x = null;
    mouseState.onMouseDownPosition.y = null;

    window.removeEventListener('mouseup', mouseUp);
  };

  const mouseDown = (e) => {
    if (document.activeElement !== titleInputRef.current) {
      e.preventDefault();

      mouseState.onMouseDownPosition.x = e.nativeEvent.clientX;
      mouseState.onMouseDownPosition.y = e.nativeEvent.clientY;

      window.addEventListener('mouseup', mouseUp);
    }
  };

  return (
    <Draggable containerId={boardId} draggableId={columnId} index={index} direction="horizontal" type="column">
      {(dragProvided, snapshot) => (
        <div {...dragProvided.draggableProps} ref={dragProvided.innerRef} className="column-drag-area drag-target">
          <Column
            isDragging={snapshot.isThisElementDragging}
            dragHandleProps={dragProvided.dragHandleProps}
            refs={{
              titleInputRef,
              editingTargetRef,
            }}
            columnData={{
              columnId,
              listTitle,
              position,
              cards: columnsWithCards[columnId].cards,
            }}
            mouseDown={mouseDown}
            mouseUp={mouseUp}
            handleError={handleError}
          />
        </div>
      )}
    </Draggable>
  );
};


ColumnContainer.propTypes = propTypes;


export default ColumnContainer;
