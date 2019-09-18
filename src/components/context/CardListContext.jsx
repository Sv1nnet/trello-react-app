import React, { useState, useEffect, createContext } from 'react';
import { connect } from 'react-redux';
import boardActions from '../../actions/boardActions';

const CardListContext = createContext();

const CardListContextProvider = (props) => {
  const {
    children,
    token,
    board,
    sortedCards,
    updateCardPositions,
  } = props;
  const [cardsState, setCardsState] = useState({
    sortedCards: [[...sortedCards]],
    // sortedCards: board.localCards.length > 0
      // If there is localColumns (cashed)
      // ? board.localCards.sort((columnOne, columnTwo) => {
      //   if (columnOne.position < columnTwo.position) return -1;
      //   if (columnOne.position > columnTwo.position) return 1;
      //   return 0;
      // })
      // : board.cards.sort((columnOne, columnTwo) => {
      //   if (columnOne.position < columnTwo.position) return -1;
      //   if (columnOne.position > columnTwo.position) return 1;
      //   return 0;
      // }),
  });
  // Save changes in cashedCards and then compare them with initial card positions in cardsState.sortedCards
  const cashedCards = cardsState.sortedCards.map(card => ({
    _id: card._id,
    column: card.column,
    position: card.position,
  }));

  const switchCardPositions = (source, target) => {
    const sourcePosition = cashedCards.find(card => card._id === source._id).position;
    const targetPosition = cashedCards.find(card => card._id === target._id).position;

    cashedCards.find(card => card._id === source._id).position = targetPosition;
    cashedCards.find(card => card._id === target._id).position = sourcePosition;
  };

  useEffect(() => {
    setCardsState({
      sortedCards: [...sortedCards],
    });
  }, []);

  return (
    <CardListContext.Provider value={{ cashedCards }}>
      {children}
    </CardListContext.Provider>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  // Send request to the server to update card positions
  updateCardPositions: (token, boardId, cards) => dispatch(boardActions.updateCardPositions(token, boardId, cards)),
  // Switch card positions locally with no sending request until card stop being dragged (mouseUp event)
  switchCardPositions: cards => dispatch(boardActions.switchCardPositions(cards)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardListContextProvider);
