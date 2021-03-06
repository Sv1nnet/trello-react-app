// React/Redux components
import { useContext, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

// Context
import { DragDropContext } from './DragDropContext';

// Utils
import dragElement from '../../../utlis/dragElement';
import isMouseMoved from '../../../utlis/isMouseMoved';
import createPlaceholder from '../../../utlis/createPlaceholder';


const propTypes = {
  children: PropTypes.func.isRequired,
  containerId: PropTypes.string.isRequired,
  draggableId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  direction: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  dragHandlers: PropTypes.shape({
    onDragStart: PropTypes.func,
    onDragUpdate: PropTypes.func,
    onDragEnd: PropTypes.func,
  }),
};

const defaultProps = {
  dragHandlers: {},
};


const Draggable = (props) => {
  const {
    containerId,
    draggableId,
    index,
    direction,
    type,
    children,
    dragHandlers,
  } = props;

  const DNDContext = useContext(DragDropContext);

  const {
    dragState,
    dragStart,
    dragUpdate,
    dragEnd,
  } = DNDContext || { dragState: { draggind: false } }; // Need this "OR" condition in case of Draggable component is being placed out of DNDContext scope

  const draggableElementRef = useRef();
  const draggableAnchorRef = useRef();

  // Store position where mouseDown event occurred in order to
  // find out did user move mouse far enough to start dragging an element
  const mouseState = {
    onMouseDownPosition: {
      x: null,
      y: null,
    },
  };

  // Need this to set initial element position on dragStart event since it's gonna be positioned as absolute or fixed
  const initialElementPosition = {
    x: null,
    y: null,
  };

  // TargetIndex will be an index of an element the onMouseEnter event occurred on
  // or index of placeholder that we put on a new position before we execute this function
  const getTargetIndex = useCallback((placeholder, source, container) => {
    // If item just moved into another list
    if (placeholder.dataset.containerId !== containerId) {
      if (placeholder.dataset.originalContainerId === containerId) {
        return index - 1;
      }

      return index;
    }

    const childrenItems = Array.prototype.filter
      .call(
        container.querySelectorAll(`[data-droppable-id="${containerId}"] > [data-draggable-id]`),
        item => source.id !== item.dataset.draggableId,
      );

    return childrenItems.findIndex(item => item === placeholder);
  }, [index, containerId]);

  const onMouseMove = (e) => {
    if (!dragState.dragging && isMouseMoved(e, mouseState.onMouseDownPosition, 5)) {
      window.removeEventListener('mousemove', onMouseMove);

      // Here we need to keep order in this code cuz container of dragging element is scrolled element once element is started dragging
      // So first of all we create a placeholder
      const placeholder = createPlaceholder({
        element: draggableElementRef.current,
        dataset: {
          type: 'placeholder',
          draggableIndex: index,
          draggableId: 'placeholder', // Need this prop to find placeholder in getTargetIndex function
          containerId,
          originalContainerId: containerId,
        },
        shouldDeleteCurrent: true,
      });

      // Then start to drag the element
      dragElement(e, draggableElementRef, initialElementPosition);
      // Then insert placeholder
      draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current);

      dragStart({
        draggableContainerId: containerId,
        draggableId,
        index,
        type,
      },
      dragHandlers.onDragStart);
    }
  };

  const onMouseEnter = () => {
    if (dragState.dragging && dragState.type === type) {
      const placeholder = document.querySelector('[data-type="placeholder"]');
      const container = document.querySelector(`[data-droppable-id="${containerId}"]`);
      const containerScrollPosition = container.scrollTop;

      const offsetPosition = direction === 'vertical' ? 'offsetTop' : 'offsetLeft';

      let targetIndex = index;
      if (placeholder) {
        if (placeholder.dataset.containerId === containerId) {
          if (placeholder[offsetPosition] < draggableElementRef.current[offsetPosition]) {
            draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current.nextElementSibling);
          } else {
            draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current);

            // We need this condition because when we drag a card above another card
            // and card's container is being scrolled by scrollElements function a vertical scroll
            // of the container jumps back due to inserting an element before a card we mouse move on
            if (direction === 'vertical') {
              if (container.scrollTo) {
                container.scrollTo(0, containerScrollPosition);
              } else {
                container.scrollLeft = 0;
                container.scrollTop = containerScrollPosition;
              }
            }
          }
        } else {
          draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current);
          placeholder.dataset.containerId = containerId;
        }
        targetIndex = getTargetIndex(placeholder, dragState.source, container);

        placeholder.dataset.draggableIndex = targetIndex;
      }

      dragUpdate({
        targetContainerId: containerId,
        index: targetIndex,
        targetId: draggableId,
      }, dragHandlers.onDragUpdate);
    }
  };

  const onMouseUp = () => {
    const placeholder = document.querySelector('[data-type="placeholder"]');
    if (placeholder) {
      placeholder.parentNode.removeChild(placeholder);
    }

    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    dragEnd(dragHandlers.onDragEnd);
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    const event = e.nativeEvent || e;

    if (event.button === 0) {
      mouseState.onMouseDownPosition.y = event.clientY;
      mouseState.onMouseDownPosition.x = event.clientX;

      initialElementPosition.y = event.offsetY;
      initialElementPosition.x = event.offsetX;

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
  };

  const provider = DNDContext
    ? {
      dragHandleProps: {
        ref: draggableAnchorRef,
        onMouseDown,
      },
      draggableProps: {
        onMouseEnter,
        key: draggableId,
        'data-draggable-id': draggableId,
        'data-draggable-index': index,
        'data-draggable-direction': direction || 'vertical',
        'data-draggable-type': type || '',
      },
      innerRef: draggableElementRef,
    }
    : null; // Need this ternary operator in case of Draggable component is being placed out of DNDContext scope

  const snapshot = DNDContext
    ? {
      ...dragState,
      isThisElementDragging: dragState.dragging && dragState.draggableId === draggableId,
    }
    : null; // Need this ternary operator in case of Draggable component is being placed out of DNDContext scope

  return children(provider, snapshot);
};


Draggable.propTypes = propTypes;
Draggable.defaultProps = defaultProps;


export default Draggable;
