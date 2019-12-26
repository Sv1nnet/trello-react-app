/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-param-reassign */
import React, { Component, createContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ColumnListContext } from '../../context/ColumnListContext';
import boardActions from '../../../actions/boardActions';
import scrollElements from '../../../utlis/scrollElements';


const propTypes = {
  user: PropTypes.shape({
    token: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  handleError: PropTypes.func.isRequired,
  onDragStart: PropTypes.func,
  onDragUpdate: PropTypes.func,
  onDragEnd: PropTypes.func,
  switchCards: PropTypes.func.isRequired,
  switchColumns: PropTypes.func.isRequired,
};


const defaultProps = {
  onDragStart: null,
  onDragUpdate: null,
  onDragEnd: null,
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
          hireScrollElementHandlers({
            scrollOption: {
              elementToScroll: cardListContainer,
              scrollIntervals,
              distanceToStartScrollingY: 100,
              scrollStepY: 7,
              scrollY: true,
            },
            dragStartedInCurrentContainer: id === dragState.source.containerId,
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
      switchCards,
      switchColumns,
    } = this;

    const { source, target, type } = state.dragState;
    let switchResultPromise;

    if (source.containerId !== target.containerId || source.index !== target.index) {
      if (type === 'card') {
        switchResultPromise = switchCards(source, target);
      } else {
        switchResultPromise = switchColumns(source, target);
      }

      if (switchResultPromise) {
        switchResultPromise
          .then((data) => {
            if (handler) return handler(data);

            return data;
          })
          .catch((err) => {
            props.handleError(err);
            if (handler) return Promise.reject(handler(err));

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
    }), () => { if (props.onDragEnd) props.onDragEnd(this.state); });
  };

  switchColumns = (source, target) => {
    const { context, props } = this;
    const { columnsWithCards } = context;

    const { token } = props.user;
    const { board } = props;

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

    return props.switchColumns(token.token, board._id, newColumns);
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
DragDropContextProvider.defaultProps = defaultProps;


const mapStateToProps = state => ({
  user: state.user,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  switchCards: data => dispatch(boardActions.switchCardPositions(data)),
  switchColumns: (token, boardId, data) => dispatch(boardActions.switchColumnPositions(token, boardId, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContextProvider);
