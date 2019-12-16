import React, { useState, useContext, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from './DragDropContext';
import dragElement from '../../../utlis/dragElement';
import isMouseMoved from '../../../utlis/isMouseMoved';
import removeEvents from '../../../utlis/removeEvents';
import addEvents from '../../../utlis/addEvents';
import createPlaceholder from '../../../utlis/createPlaceholder';


const propTypes = {
  children: PropTypes.func.isRequired,
};


const Draggable = (props) => {
  const {
    containerId,
    draggableId,
    index,
    direction,
    type,
    children,
  } = props;

  const {
    draggableHTMLElements,
    dragState,
    dragStart,
    dragUpdate,
    dragEnd,
  } = useContext(DragDropContext);

  // console.log(dragState);
  // console.log('index', index)
  const draggableElementRef = useRef();
  const draggableAnchorRef = useRef();

  const mouseState = {
    onMouseDownPosition: {
      x: null,
      y: null,
    },
  };
  const initialElementPosition = {
    x: null,
    y: null,
  };

  const getTargetIndex = useCallback((placeholder, source, target, container) => {
    const placeholderOriginalContainerId = placeholder.dataset.originalContainerId;
    const placeholderCurrentContainerId = placeholder.dataset.containerId;

    if (placeholder.dataset.containerId !== containerId) {
      // If item just moved into another list
      if (placeholderCurrentContainerId !== containerId) {
        if (placeholderOriginalContainerId === containerId) {
          return index - 1;
        }

        return index;
      }
    }

    const childrenItems = Array.from(container.querySelectorAll(`[data-droppable-id="${containerId}"] > [data-draggable-id]`)).filter(item => source.id !== item.dataset.draggableId);
    return childrenItems.findIndex(item => item === placeholder);
  }, [index, containerId]);

  const onMouseMove = (e) => {
    if (!dragState.dragging && isMouseMoved(e, mouseState.onMouseDownPosition, 5)) {
      window.removeEventListener('mousemove', onMouseMove);

      // Here we need to keep order in this code cuz container of dragging elements scroll element once element is started dragging
      // So first of all we create a placeholder
      const placeholder = createPlaceholder(draggableElementRef.current, {
        type: 'placeholder',
        draggableIndex: index,
        draggableId: -1, // Need this prop to find placeholder in getTargetIndex function
        containerId,
        originalContainerId: containerId,
      });

      // Then start to drag the element
      dragElement(e, draggableElementRef, initialElementPosition);
      // Then insert placeholder
      draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current);
      // console.log('placeholder bounries', placeholder.getBoundingClientRect())

      dragStart({ draggableContainerId: containerId, draggableId, index, type });
    }
  };

  const onMouseEnter = (e) => {
    if (dragState.dragging && dragState.type === type) {
      const placeholder = document.querySelector('[data-type="placeholder"]');
      const container = document.querySelector(`[data-droppable-id="${containerId}"]`)

      const offsetPosition = direction === 'vertical' ? 'offsetTop' : 'offsetLeft';

      let targetIndex = index;
      if (placeholder) {
        if (placeholder.dataset.containerId === containerId) {
          if (placeholder[offsetPosition] < draggableElementRef.current[offsetPosition]) {
            draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current.nextElementSibling);
          } else {
            draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current);
          }
        } else {
          draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current);
          placeholder.dataset.containerId = containerId;
        }
        targetIndex = getTargetIndex(placeholder, dragState.source, draggableElementRef.current, container);

        placeholder.dataset.draggableIndex = targetIndex;
      }

      dragUpdate({
        targetContainerId: containerId,
        index: targetIndex,
        targetId: draggableId,
        type,
      });
    }
  };

  const onMouseUp = (e) => {
    const placeholder = document.querySelector('[data-type="placeholder"]');
    if (placeholder) placeholder.remove();

    removeEvents([
      {
        target: window,
        events: [
          {
            type: 'mousemove',
            handler: onMouseMove,
          },
          {
            type: 'mouseup',
            handler: onMouseUp,
          },
        ],
      },
    ]);
    dragEnd();
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    const event = e.nativeEvent || e;

    if (event.button === 0) {
      mouseState.onMouseDownPosition.y = event.clientY;
      mouseState.onMouseDownPosition.x = event.clientX;

      initialElementPosition.y = event.offsetY;
      initialElementPosition.x = event.offsetX;

      addEvents([
        {
          target: window,
          events: [
            {
              type: 'mousemove',
              handler: onMouseMove,
            },
            {
              type: 'mouseup',
              handler: onMouseUp,
            },
          ],
        },
      ]);
    }
  };

  useEffect(() => {
    const { current } = draggableAnchorRef;
    current.addEventListener('mousedown', onMouseDown);

    return () => {
      current.removeEventListener('mousedown', onMouseDown);
      console.log('cleanup')
    };
  }, [draggableHTMLElements]);

  const provider = {
    dragHandleProps: {
      // onMouseDown,
      // onMouseMove,
      // onMouseUp,
      ref: draggableAnchorRef,
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
  };

  const snapshot = {
    ...dragState,
    isThisElementDragging: dragState.dragging && dragState.draggableId === draggableId,
  };

  return children(provider, snapshot);
};


Draggable.propTypes = propTypes;


export default Draggable;
