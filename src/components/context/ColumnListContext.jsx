/* eslint-disable no-loop-func */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, createContext } from 'react';
import { connect } from 'react-redux';
import boardActions from '../../actions/boardActions';
import Messages from '../utils/Messages';
import CardContainer from '../cards/CardContainer';
import ColumnContainer from '../columns/ColumnContainer';

export const ColumnListContext = createContext();

const ColumnListContextProvider = (props) => {
  const {
    children,
    token,
    board,
  } = props;

  // const [updatingState, setUpdatingState] = useState({
  //   message: '',
  //   statusCode: undefined,
  // });

  const [updatePositionsState, setUpdatePositionsState] = useState({
    message: '',
    statusCode: undefined,
  });

  const handleError = (err) => {
    setUpdatePositionsState({
      err: {
        message: err.message,
        statusCode: err.status,
      },
    });
  };

  /* ------------- Column change positions API ------------- */

  // We need use temp column refs array because every setColumnRefs returns a new array and
  // every next CardList will have previously passed empty columnRefs without new refs from the other
  // CardList components. So we push a new ref in tempColumnRefs and then destructure it in setColumnRefs
  const tempColumnRefs = [];

  // columnRefs - all column refs. We need them to add mouse enter event handlers when user drags column
  const [columnRefs, setColumnRefs] = useState([]);

  const [columnsState, setColumnsState] = useState([]);

  // Save changes in cashedColumns and then compare them with initial column positions in columnsState.sortedColumns
  // in updatePositions functions to find out whether we should update board and send request for updating
  const cashedColumns = board.columns.map(column => ({
    _id: column._id,
    title: column.title,
    position: column.position,
  }));

  // Columns that we got from server and that didn't changed when COLUMN_SWITCHED action occured.
  // We compare them whith cashedColumns (they change when COLUMN_SWITCHED action occured) and
  // if at least one of them has changed position then we should send updatePositions request
  const initialColumns = board.columns.map(column => ({
    _id: column._id,
    title: column.title,
    position: column.position,
  }));

  const switchColumnPositions = (source, target) => {
    const sourceColumn = cashedColumns.find(column => column._id === source._id);
    const targetColumn = cashedColumns.find(column => column._id === target._id);

    const sourceRenderedColumn = columnsState.find(column => column.props.columnId === source._id);
    const targetRenderedColumn = columnsState.find(column => column.props.columnId === target._id);

    const sourcePosition = sourceColumn.position;
    const targetPosition = targetColumn.position;

    sourceColumn.position = targetPosition;
    targetColumn.position = sourcePosition;

    const updatedColumns = [];

    cashedColumns.forEach((column) => {
      updatedColumns[column.position] = columnsState.find(renderedColumn => renderedColumn.props.columnId === column._id);
    });

    updatedColumns[sourcePosition] = targetRenderedColumn;
    updatedColumns[targetPosition] = sourceRenderedColumn;

    setColumnsState(updatedColumns);
  };

  // Send request to the server in order to update column positions
  const updateColumnPositions = () => {
    // If cashedColumns has difference with initialColumns then send updateColumnPositions request
    const shouldUpdate = cashedColumns.some((column, i) => column.position !== initialColumns[i].position);

    if (shouldUpdate) {
      cashedColumns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      });

      props.updateColumnPositions(token.token, board._id, cashedColumns)
        .catch((err) => {
          setUpdatePositionsState({ message: err.message, statusCode: err.status });
          setColumnsState(() => board.columns.map((column, i) => {
            if (column._id !== columnsState[i].props.columnId) {
              return columnsState.find(columnElement => columnElement.props.columnId === column._id);
            }

            return columnsState[i];
          }));
        });
    }
  };

  // Update columns after board changed
  useEffect(() => {
    const newColumnsState = [];

    board.columns.forEach((column, i) => {

      if (!columnsState[i]) {

        newColumnsState.push((
          <ColumnContainer
            key={column._id}
            listTitle={column.title}
            columnId={column._id}
            handleError={handleError}
            columnRefsAPI={{
              columnRefs,
              tempColumnRefs,
              setColumnRefs,
            }}
          />
        ));

        return;
      }

      if (column._id !== columnsState[i].props.columnId) {
        newColumnsState.push(columnsState.find(columnElement => columnElement.props.columnId === column._id));
        return;
      }

      newColumnsState.push(columnsState[i]);
    });

    setColumnsState(newColumnsState);
  }, [board.columns]);

  useEffect(() => {
    setColumnsState(() => board.columns.map(column => (
      <ColumnContainer
        key={column._id}
        listTitle={column.title}
        columnId={column._id}
        handleError={handleError}
        columnRefsAPI={{
          columnRefs,
          tempColumnRefs,
          setColumnRefs,
        }}
      />
    )));
  }, [board._id, columnRefs]);


  /* ------------- Card change positions API ------------- */

  // Save changes in cashedColumns and then compare them with initial column positions in columnsState.sortedColumns
  // in updatePositions functions to find out whether we should update board and send request for updating
  const cashedCards = {};

  board.columns.forEach((column) => { cashedCards[column._id] = []; });

  board.cards.forEach((card) => {
    cashedCards[card.column].push({
      _id: card._id,
      title: card.title,
      column: card.column,
      position: card.position,
    });
  });

  const [cardRefs, setCardRefs] = useState([]);

  // Columns that we got from server and that didn't changed when COLUMN_SWITCHED action occured.
  // We compare them whith cashedColumns (they change when COLUMN_SWITCHED action occured) and
  // if at least one of them has changed position then we should send updatePositions request
  const initialCards = {};

  board.columns.forEach((column) => { initialCards[column._id] = []; });

  board.cards.forEach((card) => {
    initialCards[card.column].push({
      _id: card._id,
      title: card.title,
      column: card.column,
      position: card.position,
    });
  });

  const tempCards = {};

  const tempCardRefs = [];

  const [cardsState, setCardsState] = useState({});
  const [renderedCardsState, setRenderedCardsState] = useState({});
  // console.log('cardsState', cardsState);

  for (const column in cardsState) {
    const columnCards = cardsState[column].map(card => ({
      ...card,
    }));

    cashedCards[column] = [...columnCards];
    initialCards[column] = [...columnCards];
  }


  const switchCardPositions = tempRenderedCards => (source, target) => {
    // console.log('cashedCards', cashedCards)
    // console.log('initialCards', initialCards)
    const cr = cardRefs;
    // debugger;
    // console.log('renderedCardsState in switch', tempRenderedCards)
    const sourceCard = cashedCards[source.columnId].find(card => card._id === source._id);
    const targetCard = cashedCards[target.columnId].find(card => card._id === target._id);

    const sourceRenderedCard = tempRenderedCards[source.columnId].find(card => card.props.cardData.cardId === source._id);
    const targetRenderedCard = tempRenderedCards[target.columnId].find(card => card.props.cardData.cardId === target._id);

    const sourcePosition = sourceCard.position;
    const sourceColumn = sourceCard.column;

    const targetPosition = targetCard.position;
    const targetColumn = targetCard.column;

    // console.log('sourceColumn', sourceColumn)
    // console.log('targetColumn', targetColumn)

    // console.log('sourceCard', sourceCard)
    // console.log('targetCard', targetCard)

    const updatedCards = {};

    if (targetColumn === sourceColumn) {
      updatedCards[sourceColumn] = [];

      sourceCard.position = targetPosition;
      targetCard.position = sourcePosition;

      cashedCards[sourceColumn].forEach((card) => {
        const rendCard = tempRenderedCards[sourceColumn].find(renderedCard => renderedCard.props.cardData.cardId === card._id);
        updatedCards[sourceColumn][card.position] = rendCard;
      });

      updatedCards[sourceColumn][targetPosition] = sourceRenderedCard;
      updatedCards[sourceColumn][sourcePosition] = targetRenderedCard;
    } else {
      updatedCards[sourceColumn] = [];
      updatedCards[targetColumn] = [];

      cashedCards[sourceColumn].splice(sourceCard.position, 1);
      
      cashedCards[sourceColumn] = cashedCards[sourceColumn].map((card, i) => {
        card.position = i;
        return card;
      });

      sourceCard.position = targetCard.position;
      cashedCards[targetColumn].splice(targetCard.position, 0, sourceCard);
      cashedCards[targetColumn] = cashedCards[targetColumn].map((card, i) => {
        if (card._id !== sourceCard._id && card.position >= sourceCard.position) {
          card.position += 1;
          return card;
        }
        return card;
      });
      
      // console.log('cashedCards', cashedCards)
      
      cashedCards[sourceColumn].forEach((card) => {
        updatedCards[sourceColumn][card.position] = tempRenderedCards[sourceColumn].find(renderedCard => renderedCard.props.cardData.cardId === card._id);
      });

      cashedCards[targetColumn].forEach((card) => {
        if (card.column === targetColumn) {
          // console.log('looking in target Column', card)
          updatedCards[targetColumn][card.position] = tempRenderedCards[targetColumn].find(renderedCard => renderedCard.props.cardData.cardId === card._id);
        } else {
          // console.log('looking in source Column', card)
          console.log('sourceRenderedCard', sourceRenderedCard);
          updatedCards[targetColumn][card.position] = sourceRenderedCard;
          // updatedCards[targetColumn][card.position] = tempRenderedCards[sourceColumn].find(renderedCard => renderedCard.props.cardData.cardId === card._id);
        }
      });

      sourceCard.column = targetCard.column;
    }
    // console.log(updatedCards[targetColumn][0])

    console.log('tempRenderedCards in switch', {
      ...tempRenderedCards,
      ...updatedCards,
    })
    setRenderedCardsState({
      ...tempRenderedCards,
      ...updatedCards,
    });



    // cashedColumns.forEach((card) => {
    //   updatedCards[card.position] = renderedCardsState.find(renderedColumn => renderedColumn.props.columnId === column._id);
    // });

    // updatedCards[sourcePosition] = targetRenderedCard;
    // updatedCards[targetPosition] = sourceRenderedCard;

    // setRenderedCardsState(updatedCards);
    // const sourceData = {};
    // const targetData = {};

    // const result = [];

    // // Create source and target objects with cashed columns and positions info
    // const sourceCard = cashedCards[source.column].find(card => card._id === source._id);
    // const targetCard = cashedCards[target.column].find(card => card._id === target._id);

    // if (sourceCard) {
    //   sourceData.column = sourceCard.column;
    //   sourceData.position = sourceCard.position;
    // }
    // if (targetCard) {
    //   targetData.column = targetCard.column;
    //   targetData.position = targetCard.position;
    // }

    // if (sourceData.column === targetData.column) { // If card was moved inside the same column
    //   const { column } = sourceData;

    //   cashedCards[column].find(card => card._id === source._id).position = targetData.position;
    //   cashedCards[column].find(card => card._id === target._id).position = sourceData.position;

    //   cashedCards[sourceData.column].forEach((card) => { result.push(card); });
    // } else { // If card was moved to another column
    //   const sourceColumn = sourceData.column;
    //   const targetColumn = targetData.column;

    //   sourceCard.position = targetData.position;
    //   sourceCard.column = targetData.column;

    //   cashedCards[sourceColumn].forEach((card) => {
    //     if (card._id !== source._id) result.push(card);
    //   });

    //   cashedCards[targetColumn].forEach((card) => {
    //     result.push(card);
    //   });

    //   result.push(sourceCard);
    // }

    // props.switchCardPositions(result);
  };

  // Send request to the server in order to update column positions
  const updateCardPositions = () => {
    // If cashedCards has difference with initialCards then send updateCardPositions request
    // let shouldUpdate;
    // for (const column in cashedCards) {
    //   shouldUpdate = cashedCards[column].some((card, i) => card._id !== initialCards[column][i]._id);
    // }
    // // const shouldUpdate = cashedColumns.some((column, i) => column._id !== initialColumns[i]._id);

    // if (shouldUpdate) {
    //   props.updateCardPositions(token.token, board._id, cashedColumns)
    //     .catch((err) => {
    //       setUpdatingState({ message: err.message, statusCode: err.status });
    //       setCardsState(() => {
    //         const cards = {};

    //         if (board.localColumns.length > 0) {
    //           board.localColumns.forEach((column) => {
    //             cards[column._id] = board.cards.filter(card => card.column === column._id).sort((cardOne, cardTwo) => {
    //               if (cardOne.position < cardTwo.position) return -1;
    //               if (cardOne.position > cardTwo.position) return 1;
    //               return 0;
    //             });
    //           });
    //         } else {
    //           board.columns.forEach((column) => {
    //             cards[column._id] = board.cards.filter(card => card.column === column._id).sort((cardOne, cardTwo) => {
    //               if (cardOne.position < cardTwo.position) return -1;
    //               if (cardOne.position > cardTwo.position) return 1;
    //               return 0;
    //             });
    //           });
    //         }

    //         return cards;
    //       });
    //     });
    // }
  };

  // Re-sort cards after they changed (e.g. once they downloaded or their positions changed)
  useEffect(() => {
    const tempRenderedCards = {};
    const switchCards = switchCardPositions(tempRenderedCards);

    board.columns.forEach((column) => {
      const sortedCards = [];

      board.cards.forEach((card) => {
        if (card.column === column._id) sortedCards.push(card);
      });

      sortedCards.sort((cardOne, cardTwo) => {
        if (cardOne.position < cardTwo.position) return -1;
        if (cardOne.position > cardTwo.position) return 1;
        return 0;
      });

      if (!tempRenderedCards[column._id]) tempRenderedCards[column._id] = [];

      sortedCards.forEach((card) => {
        tempRenderedCards[column._id].push((
          <CardContainer
            key={card._id}
            cardData={{
              cardId: card._id,
              cardPosition: card.position,
              cardTitle: card.title,
            }}
            columnId={card.column}
            refs={{
              columnRefs,
            }}
            cardRefsAPI={{
              tempCardRefs,
              cardsContainerRef: { current: document.createElement('div') },
              setCardRefs,
            }}
            switchCards={switchCards}
          />
        ));
      });
    });

    console.log('tempcards', tempRenderedCards)

    setRenderedCardsState({ ...tempRenderedCards });
  }, [board.cards, board.columns]);

  useEffect(() => {
    // console.log('refs changed ---------------------', cardRefs);
  }, [cardRefs]);

  useEffect(() => {
    // console.log('cashedCards', cashedCards)
    for (const column in cardsState) {
      const columnCards = cardsState[column].map(card => ({
        ...card,
      }));

      cashedCards[column] = [...columnCards];
      initialCards[column] = [...columnCards];
    }
  }, [cardsState]);

  const closeMessage = () => {
    setUpdatePositionsState({
      message: '',
      statusCode: undefined,
    });
  };

  return (
    <ColumnListContext.Provider
      value={{
        cardsContextAPI: {
          cardRefs,
          setCardRefs,
          cardsState,
          tempCards,
          tempCardRefs,
          renderedCardsState,
          setRenderedCardsState,
          switchCardPositions,
          updateCardPositions,
        },
        columnContextAPI: {
          columnsState,
          switchColumnPositions,
          updateColumnPositions,
        },
      }}
    >
      {updatePositionsState.message && <Messages.ErrorMessage message={updatePositionsState.message} closeMessage={closeMessage} />}
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
