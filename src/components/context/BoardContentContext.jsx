/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, createContext } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Messages from '../utils/Messages';
import boardActions from '../../actions/boardActions';
import CardDetails from '../cards/details/CardDetails';


const propTypes = {
  user: PropTypes.shape({
    token: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  board: PropTypes.shape({
    columns: PropTypes.array.isRequired,
    cards: PropTypes.array.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  clearBoardData: PropTypes.func.isRequired,
  switchCards: PropTypes.func.isRequired,
  switchColumns: PropTypes.func.isRequired,
};


export const BoardContentContext = createContext();

const BoardContentContextProvider = (props) => {
  const {
    children,
    board,
    clearBoardData,
  } = props;

  const { columns, cards } = board;

  const [cardIdDetails, setCardIdDetails] = useState(null);
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

  /**
   * Put a column on a new position
   * @param {Object} source - contains information about a column we move
   * @param {string} source.id - id of a column we move
   * @param {number} source.index - source's index in the list of columns
   * @param {Object} target - contains information about a target column that we move a source one on
   * @param {string} target.id - container's id of a target column
   * @param {number} target.index - target's index in the list of columns
   * @return {Promise} promise that contains a result of request to the server for putting a column on a new position
   */
  const switchColumns = (source, target) => {
    const { token } = props.user;

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
  };

  /**
   * Put a card on the new position inside initial column or into another one
   * @param {Object} source - contains information about a card we move
   * @param {string} source.containerId - container's id of a card we move
   * @param {number} source.index - source's index in the list of cards
   * @param {Object} target - contains information about a target card that we move a source one on
   * @param {string} target.containerId - container's id of a target card
   * @param {number} target.index - target's index in the list of cards
   * @return {Promise} promise that contains a result of request to the server for putting a card on a new position
   */
  const switchCards = (source, target) => {
    const { token } = props.user;

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

    return props.switchCards(token.token, board._id, newCards);
  };

  const closeMessage = () => {
    setUpdatePositionsState({
      message: '',
      statusCode: undefined,
    });
  };

  const closeDetails = () => {
    setCardIdDetails(null);
  };

  const openDetails = (cardId) => {
    setCardIdDetails(cardId);
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

  let cardForDetails = null;

  if (cardIdDetails) {
    const boardLabels = {};
    board.labels.forEach((label) => {
      boardLabels[label._id] = {
        title: label.title,
        color: label.color,
        colorName: label.colorName,
      };
    });

    for (const column in columnsWithCards) {
      cardForDetails = columnsWithCards[column].cards.find(card => card._id === cardIdDetails);

      if (cardForDetails) {
        const cardLabels = [];
        cardForDetails.labels.forEach((label) => {
          if (boardLabels[label]) cardLabels.push({ id: label, ...boardLabels[label] });
        });

        cardForDetails = {
          ...cardForDetails,
          labels: cardLabels,
          columnId: column,
          columnTitle: columnsWithCards[column].title,
        };

        break;
      }
    }
  }

  return (
    <BoardContentContext.Provider
      value={{
        columnsWithCards,
        handleError,
        switchColumns,
        switchCards,
        openDetails,
        closeDetails,
      }}
    >
      {updatePositionsState.message && <Messages.ErrorMessage message={updatePositionsState.message} closeMessage={closeMessage} />}
      {children}
      {cardForDetails && ReactDOM.createPortal(
        <CardDetails
          title={cardForDetails.title}
          labels={cardForDetails.labels}
          comments={cardForDetails.comments}
          position={cardForDetails.position}
          description={cardForDetails.description}
          closeDetails={closeDetails}
          id={cardForDetails._id}
          columnTitle={cardForDetails.columnTitle}
          columnId={cardForDetails.columnId}
        />,
        document.querySelector('.App'),
      )}
    </BoardContentContext.Provider>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  // Clear board data after transition to another page.
  // We need it to prevent from showing wrong baord data.
  clearBoardData: () => dispatch(boardActions.clearBoardData()),
  switchCards: (token, boardId, data) => dispatch(boardActions.switchCardPositions(token, boardId, data)),
  switchColumns: (token, boardId, data) => dispatch(boardActions.switchColumnPositions(token, boardId, data)),
});


BoardContentContextProvider.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(BoardContentContextProvider);
