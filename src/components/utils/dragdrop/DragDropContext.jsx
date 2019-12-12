import React, { useState, createContext, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import createPlaceholder from '../../../utlis/createPlaceholder';

const defaultProps = {
  onDragStart: () => { },
  onDragUpdate: () => { },
  onDragEnd: () => { },
};

const propTypes = {
  onDragStart: PropTypes.func,
  onDragUpdate: PropTypes.func,
  onDragEnd: PropTypes.func,
};

export const DragDropContext = createContext();

const DragDropContextProvider = ({ onDragStart = () => { }, onDragUpdate = () => { }, onDragEnd = () => { }, board, children }) => {
  const [dragState, setdragState] = useState({ dragging: false, dragElementId: null });
  const [draggableHTMLElements, setDraggableHTMLElements] = useState(Array.from(document.querySelectorAll('[data-draggable-id]')));
  const [droppableHTMLElements, setDroppableHTMLElements] = useState(Array.from(document.querySelectorAll('[data-droppable-id]')));
  const [dragDropHTMLElements, setDragDropHTMLElements] = useState({});
  // const [containersChildren, ]
  // console.log('draggableHTMLElements', draggableHTMLElements)

  const setDraggableStyles = (dragElementId) => {
    // debugger
    // const draggingElementIndex = draggableHTMLElements.findIndex(el => dragElementId === el.dataset.draggableId);
    // const draggingElement = draggableHTMLElements[draggingElementIndex];
    // const computedStyle = window.getComputedStyle(draggingElement);



    // if (draggingElement.dataset.draggableDirection === 'horizontal') {
    //   console.log('hori')
    //   // const marginLeft = parseFloat(computedStyle.marginLeft);
    //   // const marginRight = parseFloat(computedStyle.marginRight);
    //   const { offsetWidth } = draggableHTMLElements[draggingElementIndex];
    //   // const totalOffset = offsetWidth + marginLeft + marginRight;
    //   const totalOffset = offsetWidth;

    //   const droppableContainer = draggingElement.parentElement;
    //   const { droppableId } = droppableContainer.dataset;

    //   dragDropHTMLElements[droppableId].forEach((el, i) => {
    //     // if (i > draggingElement.dataset.draggableIndex) el.style.transform = `translateX(${totalOffset}px)`;
    //   });
    // } else {
    //   const marginTop = parseFloat(computedStyle.marginTop);
    //   const marginBottom = parseFloat(computedStyle.marginBottom);
    //   const { offsetHeight } = draggableHTMLElements[draggingElementIndex];
    //   const totalOffset = offsetHeight + marginTop + marginBottom;

    //   draggableHTMLElements.forEach((el, i) => {
    //     // if (i > draggingElementIndex) el.style.transform = `translateY(${totalOffset}px)`;
    //   });
    // }

  };

  const dragStart = (dragElementId) => {
    onDragStart();

    setdragState(() => ({
      dragging: true,
      dragElementId,
    }));
  };

  const dragUpdate = () => {
    onDragUpdate();
  };

  const dragEnd = (dragElementId) => {
    onDragEnd();

    // const draggingElementIndex = draggableHTMLElements.findIndex(el => dragElementId === el.dataset.draggableId);
    // const draggingElement = draggableHTMLElements[draggingElementIndex];
    // const droppableContainer = draggingElement.parentElement;
    // const { droppableId } = droppableContainer.dataset;

    // dragDropHTMLElements[droppableId].forEach((el, i) => {
    //   el.style = '';
    // });
    // draggableHTMLElements.forEach((el) => { el.style.transform = ''; });

    setdragState(() => ({
      dragging: false,
      dragElementId: null,
    }));
  };

  // useEffect(() => {
  //   if (dragState.dragging) {
  //     draggableHTMLElements.forEach((el) => {
  //       const { offsetLeft } = el;
  //       el.style.transform = `translate(${offsetLeft}px)`;
  //     });
  //   } else {
  //     draggableHTMLElements.forEach((el) => { el.style.transform = ''; });
  //   }
  // }, [dragState]);

  // useEffect(() => {
  //   console.log('-'.repeat(15), 'context was mounted', '-'.repeat(15));
  // }, []);

  useEffect(() => {
    // Set state with rendered HTMLElements. This will be executed after callstack is cleared (all DOM tree is rendered)
    setTimeout(() => {
      const result = {};
      const droppableElements = Array.from(document.querySelectorAll('[data-droppable-id]'));
      const draggableElements = Array.from(document.querySelectorAll('[data-draggable-id]'));

      droppableElements.forEach((el) => {
        result[el.dataset.droppableId] = Array.from(el.children);
      });

      console.log(result);
      setDragDropHTMLElements(result);
      setDraggableHTMLElements(draggableElements);
      setDroppableHTMLElements(droppableElements);

      // draggableElements.forEach((el) => {
      //   const type = el.dataset.draggableType;

      //   if (!draggableTypes[type]) draggableTypes[type] = [];
      //   draggableTypes[type].push(el);
      // });

      // droppableElements.forEach((el) => {
      //   const type = el.dataset.droppableType;

      //   if (!droppableTypes[type]) droppableTypes[type] = [];
      //   droppableTypes[type].push(el);

      //   result[type]
      // });

      // droppableElements
      // const sortedDraggableElements = 
      // const elements = Array.from(document.querySelectorAll('[data-draggable-id]'));
      // console.log(elements);
      // window.el = elements;
      // setDraggableHTMLElements(elements);
    }, 0);
  }, [board]);

  return (
    <DragDropContext.Provider
      value={{
        draggableHTMLElements,
        dragState,
        dragStart,
        dragEnd,
        dragUpdate,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};


DragDropContext.defaultProps = defaultProps;

DragDropContext.propTypes = propTypes;

const mapStateToProps = state => ({
  board: state.board,
});

export default connect(mapStateToProps)(DragDropContextProvider);
