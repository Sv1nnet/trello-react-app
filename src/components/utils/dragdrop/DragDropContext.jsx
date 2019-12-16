import React, { Component, createContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ColumnListContext } from '../../context/ColumnListContext';
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

class DragDropContextProvider extends Component {
  static contextType = ColumnListContext;

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

  dragStart = ({ draggableContainerId, draggableId, index, type }) => {
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

DragDropContext.defaultProps = defaultProps;
DragDropContext.propTypes = propTypes;

const mapStateToProps = state => ({
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  switchCards: data => dispatch(boardActions.switchCardPositions(data)),
  switchColumns: data => dispatch(boardActions.switchColumnPositions(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContextProvider);
