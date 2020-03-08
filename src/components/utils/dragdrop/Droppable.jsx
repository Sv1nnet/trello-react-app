// React/Redux components
import {
  useContext,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

// Context
import { DragDropContext } from './DragDropContext';


const propTypes = {
  type: PropTypes.string.isRequired,
  droppableId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};


const Droppable = ({ type, droppableId, children }) => {
  const context = useContext(DragDropContext);
  const {
    dragState,
    dragUpdate,
  } = context;

  const droppableRef = useRef();

  const onMouseEnter = useCallback(() => {
    const { current } = droppableRef;
    const draggedElement = document.querySelector(`[data-draggable-id="${context.dragState.source.id}"]`);

    // Since we can put an dragged element into different list only if it comes over another element (onMouseEnter event)
    // we can't just put it into an empty list. A list with a single element. We need to do following steps:
    // 1) Get all draggable children in empty droppable container
    const droppableChildren = current.querySelectorAll('[data-draggable-id]:not([data-type="placeholder"])');
    // 2) Find out if the container is really empty
    const isDroppablEmpty = droppableChildren.length === 0;
    // 3) Or we are currently dragging an element from it, so the element in DOM still in visually empty container
    const hasOnlyBeingDraggedChild = droppableChildren.length === 1 && context.dragState.source.id === droppableChildren[0].dataset.draggableId;

    // 4) If any of those conditions is true we can put an element (a placeholder during dragging) into empty (or visually empty) container
    if (draggedElement && (isDroppablEmpty || hasOnlyBeingDraggedChild)) {
      const placeholder = document.querySelector('[data-type="placeholder"]');

      if (placeholder) {
        placeholder.dataset.containerId = droppableId;
        placeholder.dataset.draggableIndex = 0;
      }

      current.appendChild(placeholder);

      dragUpdate({
        targetContainerId: droppableId,
        index: 0,
        targetId: context.dragState.source.id,
      });
    }
  }, [context.dragState.source.id, dragUpdate, droppableId]);

  const onMouseUp = useCallback(() => {
    const { current } = droppableRef;
    current.removeEventListener('mouseenter', onMouseEnter);
    current.removeEventListener('mouseenter', onMouseUp);
  }, [onMouseEnter]);

  useEffect(() => {
    const { current } = droppableRef;

    // Since we can put an dragged element into different list only if it comes over another element (onMouseEnter event)
    // we can't just put it into an empty list. A list with a single element. We need to do following steps:
    // 1) Get all draggable children in empty container (droppable)
    const droppableChildren = current.querySelectorAll('[data-draggable-id]:not([data-type="placeholder"])');
    // 2) Find out if the container is really empty
    const isDroppablEmpty = droppableChildren.length === 0;
    // 3) Or we are currently dragging an element from it, so the element in DOM still in visually empty container
    const hasOnlyBeingDraggedChild = droppableChildren.length === 1 && context.dragState.source.id === droppableChildren[0].dataset.draggableId;

    // 4) If any of those conditions is true we can hire event handler for empty containers (droppable)
    if (context.dragState.dragging && context.dragState.type === type && (isDroppablEmpty || hasOnlyBeingDraggedChild)) {
      current.addEventListener('mouseenter', onMouseEnter);
      current.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      current.removeEventListener('mouseenter', onMouseEnter);
      current.removeEventListener('mouseup', onMouseUp);
    };
  }, [context.dragState.dragging, context.dragState.source.id, context.dragState.type, onMouseEnter, onMouseUp, type]);

  const provider = {
    droppableProps: {
      'data-droppable-id': droppableId,
    },
    innerRef: droppableRef,
  };

  return children(provider, dragState);
};


Droppable.propTypes = propTypes;


export default Droppable;
