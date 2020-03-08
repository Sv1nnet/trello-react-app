// React/Redux components
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

// Custom components
import MoveItemForm from '../../../forms/boardForms/MoveItemForm';
import PopupContainer from '../../../utils/PopupContainer';

// Context
import { BoardContentContext } from '../../../context/BoardContentContext';


const propTypes = {
  sourceColumnId: PropTypes.string.isRequired,
  sourcePosition: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired,
  deleteCard: PropTypes.func.isRequired,
  removeElement: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
};

const defaultProps = {
  style: {},
};


const MoveCardPopup = (props) => {
  const {
    sourceColumnId,
    sourcePosition,
    moveCard,
    deleteCard,
    removeElement,
    style,
  } = props;

  const { columnsWithCards } = useContext(BoardContentContext);

  const [position, setPosition] = useState(sourcePosition);
  const [columnToMove, setColumnToMove] = useState({
    ...columnsWithCards[sourceColumnId],
    id: sourceColumnId,
  });

  const columns = [];

  for (const column in columnsWithCards) {
    columns.push({
      id: column,
      title: columnsWithCards[column].title,
      position: columnsWithCards[column].position,
      cards: columnsWithCards[column].cards || [],
    });
  }

  columns.sort((columnOne, columnTwo) => {
    if (columnOne.position > columnTwo) return 1;
    if (columnOne.position < columnTwo) return -1;
    return 0;
  });

  const onColumnSelected = (e) => {
    const { target } = e;
    setColumnToMove({
      ...columnsWithCards[target.value],
      id: target.value,
    });
  };

  const onPositionSelected = (e) => {
    const { target } = e;
    setPosition(parseInt(target.value, 10));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const target = {
      containerId: columnToMove.id,
      index: position,
    };

    moveCard(target);
  };

  useEffect(() => {
    if (columnToMove.id === sourceColumnId) {
      setPosition(sourcePosition);
    }
  }, [columnToMove, sourceColumnId, sourcePosition]);

  useEffect(() => {
    setColumnToMove({
      ...columnsWithCards[sourceColumnId],
      id: sourceColumnId,
    });
  }, [columnsWithCards, sourceColumnId]);

  const labels = [
    {
      title: 'Column',
      modificator: 'select-column',
      select: {
        props: {
          defaultValue: columnToMove.id,
          onChange: onColumnSelected,
          name: 'select-column',
          id: 'select-column',
          className: 'move-item-form__select-column',
        },
        options: columns.map(column => ({
          title: column.title,
          props: {
            value: column.id,
            key: column.id,
          },
        })),
      },
      key: 'columns-label',
    },
    {
      title: 'Position',
      modificator: 'select-position',
      select: {
        props: {
          value: position,
          onChange: onPositionSelected,
          name: 'select-position',
          id: 'select-position',
          className: 'move-item-form__select-position',
        },
        options: [
          ...columnToMove.cards.map((card, index) => ({
            title: index + 1,
            props: {
              value: index,
              key: card._id,
            },
          })),
          // If destination in another column then we need create one more slot for a moving card
          columnToMove.id !== sourceColumnId
            ? {
              title: columnToMove.cards.length + 1,
              props: {
                value: columnToMove.cards.length,
                key: columnToMove.cards.length,
              },
            }
            : null,
        ],
      },
      key: 'positions-label',
    },
  ];

  return (
    <PopupContainer
      removeElement={removeElement}
      closeBtn
      extraClasses={['card-details__popup']}
      style={style}
    >
      <MoveItemForm
        title="Move Card"
        labels={labels}
        deleteBtn={{
          title: 'Delete',
          onClick: deleteCard,
        }}
        onSubmit={onSubmit}
      />
    </PopupContainer>
  );
};


MoveCardPopup.propTypes = propTypes;
MoveCardPopup.defaultProps = defaultProps;


export default MoveCardPopup;
