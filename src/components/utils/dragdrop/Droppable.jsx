import React, { useContext, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from './DragDropContext';
import scrollElements from '../../../utlis/scrollElements';
import createPlaceholder from '../../../utlis/createPlaceholder';


const propTypes = {
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

    const droppableChildren = Array.from(current.querySelectorAll('[data-draggable-id]:not([data-type="placeholder"])'));
    const isDroppablEmpty = droppableChildren.length === 0;
    const hasOnlyBeingDraggedChild = droppableChildren.length === 1 && context.dragState.source.id === droppableChildren[0].dataset.draggableId;

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
    const droppableChildren = Array.from(current.querySelectorAll('[data-draggable-id]:not([data-type="placeholder"])'));
    const isDroppablEmpty = droppableChildren.length === 0;
    const hasOnlyBeingDraggedChild = droppableChildren.length === 1 && context.dragState.source.id === droppableChildren[0].dataset.draggableId;

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
