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
  const tempIndex = useRef(index);

  const getTargetIndex = useCallback((placeholder, target) => {
    const placeholderIndex = parseInt(placeholder.dataset.draggableIndex, 10);
    const placeholderOriginalContainerId = placeholder.dataset.originalContainerId;
    const offsetPosition = direction === 'vertical' ? 'offsetTop' : 'offsetLeft';

    // placeholder comes after target item
    if (placeholder[offsetPosition] > target[offsetPosition]) {
      if (placeholderIndex === index) {
        return index - 1;
      }
      // if (placeholderIndex - index > 1) {
      //   return index - 1;
      // }
      return index;
    }

    // placeholder comes before target item
    if (placeholder[offsetPosition] < target[offsetPosition]) {
      if (placeholderIndex === index || placeholderOriginalContainerId !== containerId) {
        return index + 1;
      }
      // if (index - placeholderIndex > 1) {
      //   return index + 1;
      // }
      return index;
    }

    // placeholder is on the same position with target item
    if (placeholderIndex !== index) {
      return index - 1;
    }
    return index;

  }, [index, containerId])

  const onMouseMove = (e) => {
    if (!dragState.dragging && isMouseMoved(e, mouseState.onMouseDownPosition, 5)) {
      window.removeEventListener('mousemove', onMouseMove);

      // Here we need to keep order in this code cuz container of dragging elements scroll element once element is started dragging
      // So first of all we create a placeholder
      const placeholder = createPlaceholder(draggableElementRef.current);

      // Then start to drag the element
      dragElement(e, draggableElementRef, initialElementPosition);
      // Then insert placeholder
      draggableElementRef.current.parentElement.insertBefore(placeholder, draggableElementRef.current);
      // console.log('placeholder bounries', placeholder.getBoundingClientRect())

      dragStart({ draggableContainerId: containerId, draggableId, index, type });
    }
  };

  const onMouseEnter = (e) => {
    // dragEvents.onUpdate(e);
    if (dragState.dragging && dragState.type === type) {
      const placeholder = document.querySelector('[data-type="placeholder"]');
      const container = document.querySelector(`[data-droppable-id="${containerId}"]`)

      const offsetPosition = direction === 'vertical' ? 'offsetTop' : 'offsetLeft';

      let targetIndex = index;
      // debugger;
      if (placeholder) {
        targetIndex = getTargetIndex(placeholder, draggableElementRef.current);
        console.log('targetIndex', targetIndex)

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
    // const phOffsetY = placeholder.getBoundingClientRect().y;
    // const phOffsetX = placeholder.getBoundingClientRect().x;
    if (placeholder) placeholder.remove();

    // draggableElementRef.current.style.position = 'fixed';
    // draggableElementRef.current.style.left = phOffsetX;
    // draggableElementRef.current.style.top = phOffsetY;

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
    console.log('dragEnd', { containerId, draggableId, tempIndex, type })
    dragEnd(tempIndex);
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
    // console.log('effect', dragState)
    current.addEventListener('mousedown', onMouseDown);

    return () => {
      current.removeEventListener('mousedown', onMouseDown);
      console.log('cleanup')
    };
  }, [draggableHTMLElements]);

  useEffect(() => {
    tempIndex.current = index;
  }, [index]);

  const provider = {
    dragHandleProps: {
      // onMouseDown,
      // onMouseMove,
      // onMouseUp,
      ref: draggableAnchorRef,
    },
    draggableProps: {
      // onMouseLeave: () => { if (dragState.dragging) console.log('mouseleave', index)},
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
