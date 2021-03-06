// React/Redux
import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';

// Custom components
import Draggable from '../utils/dragdrop/Draggable';
import Column from './Column';

// Context
import { BoardContentContext } from '../context/BoardContentContext';

// Utils
import isMouseMoved from '../../utlis/isMouseMoved';

// Style
import '../../styles/cardsList.sass';


const propTypes = {
  boardId: PropTypes.string.isRequired,
  listTitle: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
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
    statusHook,
  } = props;

  const { columnsWithCards, moveColumn } = useContext(BoardContentContext);
  const cards = columnsWithCards[columnId] ? columnsWithCards[columnId].cards : [];

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
    <Draggable dragHandlers={{ onDragEnd: moveColumn }} containerId={boardId} draggableId={columnId} index={index} direction="horizontal" type="column">
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
              cards,
            }}
            mouseDown={mouseDown}
            mouseUp={mouseUp}
            statusHook={statusHook}
          />
        </div>
      )}
    </Draggable>
  );
};


ColumnContainer.propTypes = propTypes;


export default ColumnContainer;
