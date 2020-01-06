/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, createContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Messages from '../utils/Messages';
import boardActions from '../../actions/boardActions';


const propTypes = {
  board: PropTypes.shape({
    columns: PropTypes.array.isRequired,
    cards: PropTypes.array.isRequired,
  }).isRequired,
  clearBoardData: PropTypes.func.isRequired,
};


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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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


ColumnListContextProvider.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(ColumnListContextProvider);
