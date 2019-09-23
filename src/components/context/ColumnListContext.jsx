/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, createContext } from 'react';
import { connect } from 'react-redux';
import boardActions from '../../actions/boardActions';
import Messages from '../utils/Messages';

export const ColumnListContext = createContext();

const ColumnListContextProvider = (props) => {
  const {
    children,
    token,
    board,
  } = props;

  const [updatingState, setUpdatingState] = useState({
    message: '',
    statusCode: undefined,
  });


  /* ------------- Column change positions API ------------- */

  const [columnsState, setColumnsState] = useState({
    sortedColumns: board.localColumns.length > 0
      // If there is localColumns (cashed)
      ? board.localColumns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      })
      : [...board.columns],
  });

  // Save changes in cashedColumns and then compare them with initial column positions in columnsState.sortedColumns
  // in updatePositions functions to find out whether we should update board and send request for updating
  const cashedColumns = columnsState.sortedColumns.map(column => ({
    _id: column._id,
    title: column.title,
    position: column.position,
  }));

  // Columns that we got from server and that didn't changed when COLUMN_SWITCHED action occured.
  // We compare them whith cashedColumns (they change when COLUMN_SWITCHED action occured) and
  // if at least one of them has changed position then we should send updatePositions request
  const initialColumns = columnsState.sortedColumns.length > 0
    ? [...board.columns]
    : [];

  const switchColumnPositions = (source, target) => {
    const sourceColumn = cashedColumns.find(column => column._id === source._id);
    const targetColumn = cashedColumns.find(column => column._id === target._id);

    const sourcePosition = sourceColumn.position;
    const targetPosition = targetColumn.position;

    sourceColumn.position = targetPosition;
    targetColumn.position = sourcePosition;

    props.switchColumnPositions(cashedColumns);
  };

  // Send request to the server in order to update column positions
  const updateColumnPositions = () => {
    // If cashedColumns has difference with initialColumns then send updateColumnPositions request
    const shouldUpdate = cashedColumns.some((column, i) => column._id !== initialColumns[i]._id);

    if (shouldUpdate) {
      props.updateColumnPositions(token.token, board._id, cashedColumns)
        .catch((err) => {
          setUpdatingState({ message: err.message, statusCode: err.status });
          setColumnsState({
            sortedColumns: board.columns.sort((columnOne, columnTwo) => {
              if (columnOne.position < columnTwo.position) return -1;
              if (columnOne.position > columnTwo.position) return 1;
              return 0;
            }),
          });
        });
    }
  };

  // Re-sort columns after they changed(e.g. once they downloaded or their positions changed)
  useEffect(() => {
    setColumnsState({
      sortedColumns: board.localColumns.length > 0
        ? board.localColumns.sort((columnOne, columnTwo) => {
          if (columnOne.position < columnTwo.position) return -1;
          if (columnOne.position > columnTwo.position) return 1;
          return 0;
        })
        : board.columns.sort((columnOne, columnTwo) => {
          if (columnOne.position < columnTwo.position) return -1;
          if (columnOne.position > columnTwo.position) return 1;
          return 0;
        }),
    });
  }, [board]);


  /* ------------- Card change positions API ------------- */

  // Save changes in cashedColumns and then compare them with initial column positions in columnsState.sortedColumns
  // in updatePositions functions to find out whether we should update board and send request for updating
  const cashedCards = {};

  // Columns that we got from server and that didn't changed when COLUMN_SWITCHED action occured.
  // We compare them whith cashedColumns (they change when COLUMN_SWITCHED action occured) and
  // if at least one of them has changed position then we should send updatePositions request
  const initialCards = {};

  const [cardsState, setCardsState] = useState({});
  // console.log('cardsState', cardsState);

  for (const column in cardsState) {
    const columnCards = cardsState[column].map(card => ({
      _id: card._id,
      column: card.column,
      position: card.position,
    }));

    cashedCards[column] = [...columnCards];
    initialCards[column] = [...columnCards];
  }

  const switchCardPositions = (source, target) => {
    const sourceData = {};
    const targetData = {};

    // Create source and target objects with cashed columns and positions info
    for (const column in cashedCards) {
      const sourceCard = cashedCards[column].find(card => card._id === source._id);
      const targetCard = cashedCards[column].find(card => card._id === target._id);

      sourceData.column = sourceCard.column;
      sourceData.position = sourceCard.position;

      targetData.column = targetCard.column;
      targetData.position = targetCard.position;
    }

    if (sourceData.column === targetData.column) { // If card was moved inside the same column
      const { column } = sourceData;

      cashedCards[column].find(card => card._id === source._id).position = targetData.position;
      cashedCards[column].find(card => card._id === target._id).position = sourceData.position;
    } else { // If card was moved to another column
      const sourceColumn = sourceData.column;
      const targetColumn = targetData.column;

      let sourceCard;
      let targetCard;

      for (const column in cashedCards) {
        const sourceCardIndex = cashedCards[column].findIndex(card => card._id === source._id);
        const targetCardIndex = cashedCards[column].findIndex(card => card._id === target._id);

        if (sourceCardIndex !== -1) {
          sourceCard = cashedCards.splice(sourceCardIndex, 1);
        }
        if (sourceCardIndex !== -1) {
          targetCard = cashedCards.splice(targetCardIndex, 1);
        }
      }

      sourceCard.column = targetColumn;
      sourceCard.position = targetCard.position;

      // TODO: set source position and the rest elemets after it
      const cardsWithNewPosition = cashedCards[targetColumn]
        .splice(target.position)
        .map(card => ({
          ...card,
          position: card.position + 1,
        }));

      cashedCards[targetColumn].splice(target.position, 0, sourceCard, ...cardsWithNewPosition);
    }

    const result = [];

    for (const column in cashedCards) {
      cashedCards[column].forEach((card) => { result.push(card); });
    }

    props.switchCardPositions(result);
  };

  // Send request to the server in order to update column positions
  const updateCardPositions = () => {
    // If cashedCards has difference with initialCards then send updateCardPositions request
    let shouldUpdate;
    for (const column in cashedCards) {
      shouldUpdate = cashedCards[column].some((card, i) => card._id !== initialCards[column][i]._id);
    }
    // const shouldUpdate = cashedColumns.some((column, i) => column._id !== initialColumns[i]._id);

    if (shouldUpdate) {
      props.updateCardPositions(token.token, board._id, cashedColumns)
        .catch((err) => {
          setUpdatingState({ message: err.message, statusCode: err.status });
          setCardsState(() => {
            const cards = {};

            if (board.localColumns.length > 0) {
              board.localColumns.forEach((column) => {
                cards[column._id] = board.cards.filter(card => card.column === column._id).sort((cardOne, cardTwo) => {
                  if (cardOne.position < cardTwo.position) return -1;
                  if (cardOne.position > cardTwo.position) return 1;
                  return 0;
                });
              });
            } else {
              board.columns.forEach((column) => {
                cards[column._id] = board.cards.filter(card => card.column === column._id).sort((cardOne, cardTwo) => {
                  if (cardOne.position < cardTwo.position) return -1;
                  if (cardOne.position > cardTwo.position) return 1;
                  return 0;
                });
              });
            }

            return cards;
          });
        });
    }
  };

  // Re-sort cards after they changed (e.g. once they downloaded or their positions changed)
  useEffect(() => {
    setCardsState(() => {
      const cards = {};

      if (board.localCards.length > 0) {
        board.columns.forEach((column) => {
          cards[column._id] = board.localCards.filter(card => card.column === column._id).sort((cardOne, cardTwo) => {
            if (cardOne.position < cardTwo.position) return -1;
            if (cardOne.position > cardTwo.position) return 1;
            return 0;
          });
        });
      } else {
        board.columns.forEach((column) => {
          cards[column._id] = board.cards.filter(card => card.column === column._id).sort((cardOne, cardTwo) => {
            if (cardOne.position < cardTwo.position) return -1;
            if (cardOne.position > cardTwo.position) return 1;
            return 0;
          });
        });
      }

      return cards;
    });
  }, [board.cards, board.columns, board.localCards]);

  const closeMessage = () => {
    setUpdatingState({
      message: '',
      statusCode: undefined,
    });
  };

  return (
    <ColumnListContext.Provider value={{ columnsState, switchColumnPositions, updateColumnPositions, switchCardPositions, updateCardPositions }}>
      {updatingState.message && <Messages.ErrorMessage message={updatingState.message} closeMessage={closeMessage} />}
      {children}
    </ColumnListContext.Provider>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  // Send request to the server to update column positions
  updateColumnPositions: (token, boardId, columns) => dispatch(boardActions.updateColumnPositions(token, boardId, columns)),
  // Switch column positions locally with no sending request until column stop being dragged (mouseUp event)
  switchColumnPositions: newColumns => dispatch(boardActions.switchColumnPositions(newColumns)),
  // Send request to the server to update card positions
  updateCardPositions: (token, boardId, cards) => dispatch(boardActions.updateCardPositions(token, boardId, cards)),
  // Switch cards positions locally with no sending request until card stop being dragged (mouseUp event)
  switchCardPositions: newCards => dispatch(boardActions.switchCardPositions(newCards)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnListContextProvider);
