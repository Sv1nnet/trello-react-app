/* eslint-disable no-loop-func */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, createContext } from 'react';
import { connect } from 'react-redux';
import Messages from '../utils/Messages';
import boardActions from '../../actions/boardActions';

export const ColumnListContext = createContext();

const ColumnListContextProvider = (props) => {
  const {
    children,
    board,
    clearBoardData,
  } = props;

  const { columns, cards } = board;

  const [updatePositionsState, setUpdatePositionsState] = useState({
    message: '',
    statusCode: undefined,
  });

  const handleError = (err) => {
    setUpdatePositionsState({
      message: err.message,
      statusCode: err.status,
    });
  };

  const [columnsWithCards, setColumnsWithCards] = useState(() => {
    const result = {};

    columns.forEach((column) => {
      result[column._id] = {
        title: column.title,
        position: column.position,
        cards: cards.filter(card => card.column === column._id).sort((cardOne, cardTwo) => {
          if (cardOne.position > cardTwo.position) return 1;
          if (cardOne.position < cardTwo.position) return -1;
          return 0;
        }),
      };
    });

    return result;
  });

  const closeMessage = () => {
    setUpdatePositionsState({
      message: '',
      statusCode: undefined,
    });
  };

  useEffect(() => {
    const newColumnsWithCards = {};

    columns.forEach((column) => {
      newColumnsWithCards[column._id] = {
        title: column.title,
        position: column.position,
        cards: cards.filter(card => card.column === column._id).sort((cardOne, cardTwo) => {
          if (cardOne.position > cardTwo.position) return 1;
          if (cardOne.position < cardTwo.position) return -1;
          return 0;
        }),
      };
    });

    setColumnsWithCards(newColumnsWithCards);
  }, [cards, columns]);

  useEffect(() => () => {
    clearBoardData();
  }, []);

  return (
    <ColumnListContext.Provider
      value={{
        columnsWithCards,
        handleError,
      }}
    >
      {updatePositionsState.message && <Messages.ErrorMessage message={updatePositionsState.message} closeMessage={closeMessage} />}
      {children}
    </ColumnListContext.Provider>
  );
};

const mapStateToProps = state => ({
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  // Clear board data after transition to another page.
  // We need it to prevent from showing wrong baord data.
  clearBoardData: () => dispatch(boardActions.clearBoardData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnListContextProvider);
