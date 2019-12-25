/* eslint-disable no-param-reassign */
import React, { Component, createContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ColumnListContext } from '../../context/ColumnListContext';
import boardActions from '../../../actions/boardActions';
import scrollElements from '../../../utlis/scrollElements';


const propTypes = {
  switchCards: PropTypes.func.isRequired,
  switchColumns: PropTypes.func.isRequired,
};


export const DragDropContext = createContext();

/*
 * I use class component rather than function one cuz I need a reference on a current context's state object
 * in Draggable and Droppable components. I use the state in event handlers that I add with a browser API not React.
 */
class DragDropContextProvider extends Component {
  static contextType = ColumnListContext;

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
    const { clearScrollIntervals, scrollIntervals, scrollElement } = this;
    const { dragState } = this.state;

    if (!dragState.dragging && prevState.dragState.dragging !== dragState.dragging) {
      // Clear intervals if for a some reason scroll interval wasn't cleared after drag ended
      if (scrollIntervals.scrollHorizontalInterval || scrollIntervals.scrollVerticalInterval) clearScrollIntervals({ scrollIntervals });
    }

    if (dragState.dragging && prevState.dragState.dragging !== dragState.dragging) {
      const boardListContainer = document.querySelector('.board-lists-container');
      scrollElement({
        elementToScroll: boardListContainer,
        scrollOption: {
          elementToScroll: boardListContainer,
          scrollIntervals,
          distanceToStartScrollingX: 200,
          scrollStepX: 10,
          scrollX: true,
        },
        horizontal: true,
      });

      const cardListContainer = document.querySelector(`[data-droppable-id="${dragState.target.containerId}"]`);
      scrollElement({
        elementToScroll: cardListContainer,
        scrollOption: {
          elementToScroll: cardListContainer,
          scrollIntervals,
          distanceToStartScrollingY: 100,
          scrollStepY: 7,
          scrollY: true,
        },
        vertical: true,
      });
    }

    if (dragState.dragging && prevState.dragState.target.containerId !== dragState.target.containerId) {
      // const cardListContainer = document.querySelector(`[data-droppable-id="${dragState.target.containerId}"]`);
      // scrollElement({
      //   elementToScroll: cardListContainer,
      //   scrollOption: {
      //     elementToScroll: cardListContainer,
      //     scrollIntervals,
      //     distanceToStartScrollingY: 100,
      //     scrollStepY: 7,
      //     scrollY: true,
      //   },
      //   vertical: true,
      // });
    }
  }

  clearScrollIntervals = ({ scrollIntervals, horizontal = false, vertical = false, both = true }) => {
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

  scrollElement = (options) => {
    const {
      elementToScroll,
      scrollOption,
      horizontal = false,
      vertical = false,
      both = false,
    } = options;

    const { scrollIntervals, clearScrollIntervals } = this;
    const scrollOptions = [scrollOption];

    const scrollElement = scrollElements(scrollOptions);

    const onMouseLeave = () => {
      clearScrollIntervals({
        scrollIntervals,
        vertical,
        horizontal,
        both,
      });
    };

    const onMouseEnter = () => {
      elementToScroll.addEventListener('mousemove', scrollElement);
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

    elementToScroll.addEventListener('mousemove', scrollElement);
    elementToScroll.addEventListener('mouseleave', onMouseLeave);
    elementToScroll.addEventListener('mouseenter', onMouseEnter);

    window.addEventListener('mouseup', onMouseUp);
  }

  dragStart = (props) => {
    const {
      draggableContainerId,
      draggableId,
      index,
      type,
    } = props;

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
    }));
  };

  dragUpdate = ({ targetContainerId, targetId, index }) => {
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
    }));
  };

  dragEnd = () => {
    const { state, switchCards, switchColumns } = this;
    const { source, target, type } = state.dragState;

    if (source.containerId !== target.containerId || source.index !== target.index) {
      if (type === 'card') {
        switchCards(source, target);
      } else {
        switchColumns(source, target);
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
    }));
  };

  switchColumns = (source, target) => {
    const { context, props } = this;
    const { columnsWithCards } = context;
    const newColumns = [];

    for (const column in columnsWithCards) {
      const newColumn = {
        _id: column,
        title: columnsWithCards[column].title,
        position: columnsWithCards[column].position,
      };

      if (source.index < target.index) {
        if (columnsWithCards[column].id !== newColumn._id && columnsWithCards[column].position <= target.index && columnsWithCards[column].position > source.index) {
          newColumn.position -= 1;
        }
      } else if (source.index > target.index) {
        if (columnsWithCards[column].id !== newColumn._id && columnsWithCards[column].position >= target.index && columnsWithCards[column].position < source.index) {
          newColumn.position += 1;
        }
      }

      if (newColumn._id === source.id) {
        newColumn.position = target.index;
      }

      newColumns.push(newColumn);
    }

    props.switchColumns(newColumns);
  }

  switchCards = (source, target) => {
    const { context, props } = this;
    const { columnsWithCards } = context;

    const newCards = [];
    if (source.containerId === target.containerId) {
      for (const column in columnsWithCards) {
        if (column !== target.containerId) {
          columnsWithCards[column].cards.forEach(card => newCards.push(card));
        } else {
          const sourceCard = { ...columnsWithCards[column].cards[source.index] };

          const tempCards = [...columnsWithCards[column].cards];

          tempCards.splice(source.index, 1);
          tempCards.splice(target.index, 0, sourceCard);
          tempCards.forEach((card, i) => { card.position = i; });

          tempCards.forEach(card => newCards.push(card));
        }
      }
    } else {
      const sourceCard = { ...columnsWithCards[source.containerId].cards[source.index] };
      sourceCard.column = target.containerId;

      for (const column in columnsWithCards) {
        if (column !== target.containerId && column !== source.containerId) {
          columnsWithCards[column].cards.forEach(card => newCards.push(card));
        } else {
          const tempCards = [...columnsWithCards[column].cards];

          if (column === source.containerId) {
            tempCards.splice(source.index, 1);
          } else {
            tempCards.splice(target.index, 0, sourceCard);
          }

          tempCards.forEach((card, i) => { card.position = i; });
          tempCards.forEach(card => newCards.push(card));
        }
      }
    }

    props.switchCards(newCards);
  }

  scrollElements = (e) => {
    const { dragState } = this.state;
    const boardListContainer = document.querySelector('.board-lists-container');
    const elementToScroll = document.querySelector(`[data-droppable-id="${dragState.target.containerId}"]`);
  }

  render() {
    const {
      state,
      props,
      dragStart,
      dragEnd,
      dragUpdate,
    } = this;
    const { dragState } = state;

    return (
      <DragDropContext.Provider
        value={{
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

DragDropContextProvider.propTypes = propTypes;

const mapStateToProps = state => ({
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  switchCards: data => dispatch(boardActions.switchCardPositions(data)),
  switchColumns: data => dispatch(boardActions.switchColumnPositions(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContextProvider);
