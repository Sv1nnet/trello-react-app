/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-param-reassign */
import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import { BoardContentContext } from '../../context/BoardContentContext';
import scrollElements from '../../../utlis/scrollElements';


const propTypes = {
  handleError: PropTypes.func.isRequired,
  onDragStart: PropTypes.func,
  onDragUpdate: PropTypes.func,
  onDragEnd: PropTypes.func,
};


const defaultProps = {
  onDragStart: null,
  onDragUpdate: null,
  onDragEnd: null,
};


export const DragDropContext = createContext();

class DragDropContextProvider extends Component {
  static contextType = BoardContentContext;

  constructor(props) {
    super(props);

    this.scrollIntervals = {
      scrollHorizontalInterval: null,
      scrollVerticalInterval: null,
    };
  }

  state = {
    dragState: {
      dragging: false,
      target: {
        id: null,
        index: null,
        containerId: null,
      },
      source: {
        id: null,
        index: null,
        containerId: null,
      },
      type: null,
    },
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      clearScrollIntervals,
      scrollIntervals,
      hireScrollElementHandlers,
      state,
      context,
    } = this;

    const { dragState } = state;
    const { columnsWithCards } = context;

    if (!dragState.dragging && prevState.dragState.dragging !== dragState.dragging) {
      // Clear intervals if for a some reason scroll interval wasn't cleared after drag ended
      if (scrollIntervals.scrollHorizontalInterval || scrollIntervals.scrollVerticalInterval) clearScrollIntervals({ scrollIntervals });
    }

    // If we just started dragging
    if (dragState.dragging && prevState.dragState.dragging !== dragState.dragging) {
      const boardListContainer = document.querySelector('.board-lists-container');
      hireScrollElementHandlers({
        scrollOption: {
          elementToScroll: boardListContainer,
          scrollIntervals,
          distanceToStartScrollingX: 200,
          scrollStepX: 10,
          scrollX: true,
        },
        dragStartedInCurrentContainer: true,
        horizontal: true,
      });

      // If we dragging a card add scroll events on cards containers
      if (dragState.type === 'card') {
        const columnIds = Object.keys(columnsWithCards);

        columnIds.forEach((id) => {
          const cardListContainer = document.querySelector(`[data-droppable-id="${id}"]`);
          const dragStartedInCurrentContainer = id === dragState.source.containerId;

          hireScrollElementHandlers({
            scrollOption: {
              elementToScroll: cardListContainer,
              scrollIntervals,
              distanceToStartScrollingY: 100,
              scrollStepY: 7,
              scrollY: true,
            },
            dragStartedInCurrentContainer,
            vertical: true,
          });
        });
      }
    }
  }

  clearScrollIntervals = (options) => {
    const {
      scrollIntervals,
      horizontal = false,
      vertical = false,
      both = true,
    } = options;

    if (both) {
      window.clearInterval(scrollIntervals.scrollHorizontalInterval);
      window.clearInterval(scrollIntervals.scrollVerticalInterval);
      scrollIntervals.scrollHorizontalInterval = null;
      scrollIntervals.scrollVerticalInterval = null;
      return;
    }

    if (horizontal) {
      window.clearInterval(scrollIntervals.scrollHorizontalInterval);
      scrollIntervals.scrollHorizontalInterval = null;
    }

    if (vertical) {
      window.clearInterval(scrollIntervals.scrollVerticalInterval);
      scrollIntervals.scrollVerticalInterval = null;
    }
  }

  hireScrollElementHandlers = (options) => {
    const {
      scrollOption,
      dragStartedInCurrentContainer = false,
      horizontal = false,
      vertical = false,
      both = false,
    } = options;
    const { elementToScroll } = scrollOption;

    const { scrollIntervals, clearScrollIntervals } = this;
    const scrollOptions = [scrollOption];

    const scrollElement = scrollElements(scrollOptions);

    const onMouseEnter = () => {
      elementToScroll.addEventListener('mousemove', scrollElement);
    };

    const onMouseLeave = () => {
      elementToScroll.removeEventListener('mouseenter', onMouseEnter);
      clearScrollIntervals({
        scrollIntervals,
        vertical,
        horizontal,
        both,
      });
    };

    const onMouseUp = () => {
      elementToScroll.removeEventListener('mousemove', scrollElement);
      elementToScroll.removeEventListener('mouseenter', onMouseEnter);
      elementToScroll.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseup', onMouseUp);

      clearScrollIntervals({
        scrollIntervals,
        vertical,
        horizontal,
        both,
      });
    };

    if (dragStartedInCurrentContainer) elementToScroll.addEventListener('mousemove', scrollElement);
    elementToScroll.addEventListener('mouseleave', onMouseLeave);
    elementToScroll.addEventListener('mouseenter', onMouseEnter);

    window.addEventListener('mouseup', onMouseUp);
  }

  dragStart = (sourceData, handler) => {
    const {
      draggableContainerId,
      draggableId,
      index,
      type,
    } = sourceData;
    const { props } = this;

    this.setState(state => ({
      ...state,
      dragState: {
        dragging: true,
        target: {
          id: draggableId,
          index,
          containerId: draggableContainerId,
        },
        source: {
          id: draggableId,
          index,
          containerId: draggableContainerId,
        },
        type,
      },
    }), () => {
      if (handler) handler(this.state);
      if (props.onDragStart) props.onDragStart(this.state);
    });
  };

  dragUpdate = ({ targetContainerId, targetId, index }, handler) => {
    const { props } = this;

    this.setState(state => ({
      ...state,
      dragState: {
        ...state.dragState,
        target: {
          id: targetId,
          index,
          containerId: targetContainerId,
        },
      },
    }), () => {
      if (handler) handler(this.state);
      if (props.onDragUpdate) props.onDragUpdate(this.state);
    });
  };

  dragEnd = (handler) => {
    const {
      state,
      props,
    } = this;

    const { source, target } = state.dragState;
    let switchResultPromise;

    if (source.containerId !== target.containerId || source.index !== target.index) {
      switchResultPromise = handler ? handler(source, target) : null;

      if (switchResultPromise) {
        switchResultPromise
          .catch((err) => {
            props.handleError(err);

            return Promise.reject(err);
          });
      }
    }

    this.setState(prevState => ({
      ...prevState,
      dragState: {
        dragging: false,
        target: {
          id: null,
          index: null,
          containerId: null,
        },
        source: {
          id: null,
          index: null,
          containerId: null,
        },
        type: null,
      },
    }), () => { if (props.onDragEnd) props.onDragEnd(state); });
  };

  render() {
    const {
      state,
      props,
      dragStart,
      dragEnd,
      dragUpdate,
      switchCards,
      switchColumns,
    } = this;
    const { dragState } = state;

    return (
      <DragDropContext.Provider
        value={{
          dragState,
          dragStart,
          dragEnd,
          dragUpdate,
          switchCards,
          switchColumns,
        }}
      >
        {props.children}
      </DragDropContext.Provider>
    );
  }
}


DragDropContextProvider.propTypes = propTypes;
DragDropContextProvider.defaultProps = defaultProps;


export default DragDropContextProvider;
