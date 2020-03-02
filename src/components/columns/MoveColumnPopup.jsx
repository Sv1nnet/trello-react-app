// React/Redux compontnes
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

// Custom components
import MoveItemForm from '../forms/boardForms/MoveItemForm';
import PopupContainer from '../utils/PopupContainer';

// Context
import { BoardContentContext } from '../context/BoardContentContext';

// Styles
import '../../styles/moveItemForm.sass';


const propTypes = {
  sourcePosition: PropTypes.number.isRequired,
  sourceId: PropTypes.string.isRequired,
  moveColumn: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  removeElement: PropTypes.func.isRequired,
};


const MoveColumnPopup = (props) => {
  const {
    sourcePosition,
    sourceId,
    moveColumn,
    deleteColumn,
    removeElement,
  } = props;

  const { columnsWithCards } = useContext(BoardContentContext);
  const [destination, setDestination] = useState({
    position: sourcePosition,
    id: sourceId,
  });

  const columns = [];

  for (const column in columnsWithCards) {
    columns.push({
      id: column,
      position: columnsWithCards[column].position,
    });
  }

  columns.sort((columnOne, columnTwo) => {
    if (columnOne.position > columnTwo) return 1;
    if (columnOne.position < columnTwo) return -1;
    return 0;
  });

  const onPositionSelected = (e) => {
    const { target } = e;
    const position = parseInt(target.value, 10);

    setDestination({
      id: target.querySelector(`option[value="${position}"]`).dataset.columnId,
      position,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const target = {
      id: destination.id,
      index: destination.position,
    };

    moveColumn(target);
  };

  useEffect(() => {
    setDestination(state => ({
      ...state,
      position: sourcePosition,
    }));
  }, [sourcePosition]);

  const labels = [
    {
      title: 'Position',
      modificator: 'select-position',
      select: {
        props: {
          value: destination.position,
          onChange: onPositionSelected,
          name: 'select-position',
          id: 'select-position',
          className: 'move-item-form__select-position',
        },
        options: columns.map((column, index) => ({
          title: index + 1,
          props: {
            value: index,
            'data-column-id': column.id,
            key: column.id,
          },
        })),
      },
      key: 'positions-label',
    },
  ];

  return (
    <PopupContainer
      removeElement={removeElement}
      closeBtn
      extraClasses={['move-column-popup']}
    >
      <MoveItemForm
        title="Move Column"
        labels={labels}
        deleteBtn={{
          title: 'Delete',
          onClick: deleteColumn,
        }}
        onSubmit={onSubmit}
      />
    </PopupContainer>
  );
};


MoveColumnPopup.propTypes = propTypes;


export default MoveColumnPopup;
