import React, { Component, useState, createContext, useEffect, useLayoutEffect, useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ColumnListContext } from '../../context/ColumnListContext';
import createPlaceholder from '../../../utlis/createPlaceholder';
import boardActions from '../../../actions/boardActions';

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
// ({ onDragStart = () => { }, onDragUpdate = () => { }, onDragEnd = () => { }, board, children, switchCards })
class DragDropContextProvider extends Component {
  static contextType = ColumnListContext;

  state = {
    dragState: {
      dragging: false,
      target: {
        id: null,
        containerId: null,
      },
      source: {
        id: null,
        containerId: null,
      },
      type: null,
    },
    draggableHTMLElements: [],
    droppableHTMLElements: [],
    dragDropHTMLElements: {},
  }

  // if (!dragState.dragging) {
  //   const placeholder = document.querySelector('[data-type="placeholder"]');
  //   if (placeholder) placeholder.remove();
  // }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
    console.log('props', prevProps, this.props)
    if (prevProps.board !== this.props.board) {
      // Set state with rendered HTMLElements. This will be executed after callstack is cleared (all DOM tree is rendered)
      setTimeout(() => {
        const dragDropHTMLElements = {};
        const droppableElements = Array.from(document.querySelectorAll('[data-droppable-id]'));
        const draggableElements = Array.from(document.querySelectorAll('[data-draggable-id]'));

        droppableElements.forEach((el) => {
          dragDropHTMLElements[el.dataset.droppableId] = Array.from(el.children);
        });

        console.log(dragDropHTMLElements);
        this.setState(state => ({
          ...state,
          draggableHTMLElements: draggableElements,
          droppableHTMLElements: droppableElements,
          dragDropHTMLElements,
        }));
      }, 0);
    }
  }

  setDraggableStyles = (dragElementId) => {
  };

  dragStart = ({ draggableContainerId, draggableId, type }) => {
    // const { props } = this;
    // props.onDragStart();

    this.setState(state => ({
      ...state,
      dragState: {
        dragging: true,
        target: {
          id: null,
          containerId: null,
        },
        source: {
          id: draggableId,
          containerId: draggableContainerId,
        },
        type,
      },
    }));
  };

  dragUpdate = ({ targetContainerId, targetId, type }) => {
    // const { onDragUpdate } = this.props;
    // console.log({ containerId, target, type })
    this.setState(state => ({
      ...state,
      dragState: {
        ...state.dragState,
        target: {
          id: targetId,
          containerId: targetContainerId,
        },
      },
    }));
    // onDragUpdate();
  };

  dragEnd = () => {
    console.log('DragAndDropContext dragEnd')
    const { state, props, context, switchCards } = this;
    const { source, target, type } = state.dragState;
    const { columnsWithCards } = context;
    const { board, onDragEnd } = props;
    const { cards } = board;
    // onDragEnd();

    if (type === 'card') {
      switchCards(source, target);
    } else {

    }

    this.setState(prevState => ({
      ...prevState,
      dragState: {
        dragging: false,
        target: {
          id: null,
          containerId: null,
        },
        source: {
          id: null,
          containerId: null,
        },
        type: null,
      },
    }));
  };

  switchCards = (source, target) => {
    const { state, context, props } = this;
    const { columnsWithCards } = context;

    const newCards = [];
    for (const column in columnsWithCards) {
      if (column !== target.containerId) {
        columnsWithCards[column].cards.forEach(card => newCards.push(card));
      } else {
        // debugger;
        const sourceCard = { ...columnsWithCards[column].cards.find(card => card._id === source.id) };
        const sourcePosition = sourceCard.position;

        const targetCard = { ...columnsWithCards[column].cards.find(card => card._id === target.id) };
        const targetPosition = targetCard.position;

        const tempCards = [...columnsWithCards[column].cards];
        // debugger
        tempCards.splice(sourceCard.position, 1);
        tempCards.splice(targetCard.position, 0, sourceCard);
        tempCards.forEach((card, i) => { card.position = i; });
        // tempCards.splice(source.position, 1, target);

        // source.position = targetPosition;
        // target.position = sourcePosition;

        // console.log(source)

        tempCards.forEach(card => newCards.push(card));
      }
    }
    console.log(newCards)
    props.switchCards(newCards);
  }

  render() {
    const {
      state,
      props,
      dragStart,
      dragEnd,
      dragUpdate,
    } = this;
    const { draggableHTMLElements, dragState } = state;

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
        {props.children}
      </DragDropContext.Provider>
    );
  }
}
// const DragDropContextProvider = ({ onDragStart = () => { }, onDragUpdate = () => { }, onDragEnd = () => { }, board, children, switchCards }) => {
//   const [dragState, setdragState] = useState({ dragging: false, type: null, draggableId: null });
//   const [draggableHTMLElements, setDraggableHTMLElements] = useState(Array.from(document.querySelectorAll('[data-draggable-id]')));
//   const [droppableHTMLElements, setDroppableHTMLElements] = useState(Array.from(document.querySelectorAll('[data-droppable-id]')));
//   const [dragDropHTMLElements, setDragDropHTMLElements] = useState({});

//   const { columnsWithCards } = useContext(ColumnListContext);

//   if (!dragState.dragging) {
//     const placeholder = document.querySelector('[data-type="placeholder"]');
//     if (placeholder) placeholder.remove();
//   }

//   // const [containersChildren, ]
//   // console.log('draggableHTMLElements', draggableHTMLElements)

//   const setDraggableStyles = (dragElementId) => {
//     // debugger
//     // const draggingElementIndex = draggableHTMLElements.findIndex(el => dragElementId === el.dataset.draggableId);
//     // const draggingElement = draggableHTMLElements[draggingElementIndex];
//     // const computedStyle = window.getComputedStyle(draggingElement);

//     // if (draggingElement.dataset.draggableDirection === 'horizontal') {
//     //   console.log('hori')
//     //   // const marginLeft = parseFloat(computedStyle.marginLeft);
//     //   // const marginRight = parseFloat(computedStyle.marginRight);
//     //   const { offsetWidth } = draggableHTMLElements[draggingElementIndex];
//     //   // const totalOffset = offsetWidth + marginLeft + marginRight;
//     //   const totalOffset = offsetWidth;

//     //   const droppableContainer = draggingElement.parentElement;
//     //   const { droppableId } = droppableContainer.dataset;

//     //   dragDropHTMLElements[droppableId].forEach((el, i) => {
//     //     // if (i > draggingElement.dataset.draggableIndex) el.style.transform = `translateX(${totalOffset}px)`;
//     //   });
//     // } else {
//     //   const marginTop = parseFloat(computedStyle.marginTop);
//     //   const marginBottom = parseFloat(computedStyle.marginBottom);
//     //   const { offsetHeight } = draggableHTMLElements[draggingElementIndex];
//     //   const totalOffset = offsetHeight + marginTop + marginBottom;

//     //   draggableHTMLElements.forEach((el, i) => {
//     //     // if (i > draggingElementIndex) el.style.transform = `translateY(${totalOffset}px)`;
//     //   });
//     // }

//   };

//   const dragStart = ({ draggableId, index, type }) => {
//     onDragStart();

//     setdragState(() => ({
//       dragging: true,
//       type,
//       draggableId,
//     }));
//   };

//   const dragUpdate = ({ containerId, target, index, type }) => {

//     console.log({ containerId, target, index, type })
//     onDragUpdate();
//   };

//   const dragEnd = ({ containerId, draggableId, index, type }) => {
//     const { cards } = board;
//     onDragEnd();

//     // const draggingElementIndex = draggableHTMLElements.findIndex(el => dragElementId === el.dataset.draggableId);
//     // const draggingElement = draggableHTMLElements[draggingElementIndex];
//     // const droppableContainer = draggingElement.parentElement;
//     // const { droppableId } = droppableContainer.dataset;

//     // dragDropHTMLElements[droppableId].forEach((el, i) => {
//     //   el.style = '';
//     // });
//     // draggableHTMLElements.forEach((el) => { el.style.transform = ''; });

//     setdragState(() => ({
//       dragging: false,
//       type: null,
//       draggableId: null,
//     }));

//     const newCards = [];
//     for (const column in columnsWithCards) {
//       if (column !== containerId) {
//         columnsWithCards[column].cards.forEach(card => newCards.push(card));
//       } else {
//         const source = columnsWithCards[column].cards.find(card => card._id === draggableId);
//         const target = columnsWithCards[column].cards.find(card => card._id === dragState.draggableId);
//         const tempCards = [...columnsWithCards[column].cards];

//         console.log(source)
//         tempCards.splice(target.position, 1, source);
//         tempCards.splice(source.position, 1, target);

//         tempCards.forEach(card => newCards.push(card));
//       }
//     }

//     console.log(newCards)
//     // switchCards(newCards);
//   };

//   // useEffect(() => {
//   //   if (dragState.dragging) {
//   //     draggableHTMLElements.forEach((el) => {
//   //       const { offsetLeft } = el;
//   //       el.style.transform = `translate(${offsetLeft}px)`;
//   //     });
//   //   } else {
//   //     draggableHTMLElements.forEach((el) => { el.style.transform = ''; });
//   //   }
//   // }, [dragState]);

//   // useEffect(() => {
//   //   console.log('-'.repeat(15), 'context was mounted', '-'.repeat(15));
//   // }, []);

//   useEffect(() => {
//     // Set state with rendered HTMLElements. This will be executed after callstack is cleared (all DOM tree is rendered)
//     setTimeout(() => {
//       const result = {};
//       const droppableElements = Array.from(document.querySelectorAll('[data-droppable-id]'));
//       const draggableElements = Array.from(document.querySelectorAll('[data-draggable-id]'));

//       droppableElements.forEach((el) => {
//         result[el.dataset.droppableId] = Array.from(el.children);
//       });

//       console.log(result);
//       setDragDropHTMLElements(result);
//       setDraggableHTMLElements(draggableElements);
//       setDroppableHTMLElements(droppableElements);

//       // draggableElements.forEach((el) => {
//       //   const type = el.dataset.draggableType;

//       //   if (!draggableTypes[type]) draggableTypes[type] = [];
//       //   draggableTypes[type].push(el);
//       // });

//       // droppableElements.forEach((el) => {
//       //   const type = el.dataset.droppableType;

//       //   if (!droppableTypes[type]) droppableTypes[type] = [];
//       //   droppableTypes[type].push(el);

//       //   result[type]
//       // });

//       // droppableElements
//       // const sortedDraggableElements = 
//       // const elements = Array.from(document.querySelectorAll('[data-draggable-id]'));
//       // console.log(elements);
//       // window.el = elements;
//       // setDraggableHTMLElements(elements);
//     }, 0);
//   }, [board]);

//   return (
//     <DragDropContext.Provider
//       value={{
//         draggableHTMLElements,
//         dragState,
//         dragStart,
//         dragEnd,
//         dragUpdate,
//       }}
//     >
//       {children}
//     </DragDropContext.Provider>
//   );
// };


DragDropContext.defaultProps = defaultProps;

DragDropContext.propTypes = propTypes;

const mapStateToProps = state => ({
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  switchCards: data => dispatch(boardActions.switchCardPositions(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContextProvider);
