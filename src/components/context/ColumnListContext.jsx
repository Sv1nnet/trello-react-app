/* eslint-disable no-loop-func */
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

  const { columns, cards } = board;

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

  const [columnsWithCards, setColumnsWithCards] = useState(() => {
    const result = {};

    columns.forEach((column) => {
      result[column._id] = {
        title: column.title,
        position: column.position,
        cards: cards.filter(card => card.column === column._id).sort((cardOne, cardTwo) => {
          if (cardOne.position > cardTwo.position) return 1;
          if (cardOne.position < cardTwo.position) return 1;
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
          if (cardOne.position < cardTwo.position) return 1;
          return 0;
        }),
      };
    });

    setColumnsWithCards(newColumnsWithCards);
  }, [cards, columns]);

  return (
    <ColumnListContext.Provider
      value={{
        columnsWithCards,
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
