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

  // const [detailsOpened, setDetailsOpened] = useState(false);
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
    // const { title, labels, comments, position, description, cardId, columnTitle, columnId } = propsForDetails;
    // setPropsForCardDetails(propsForDetails);
    // const cardForDetails = columnsWithCards[columnId].cards.find(card => card._id === cardId);
    // setCardDetails(
    //   <CardDetails
    //     title={cardForDetails.title}
    //     labels={cardForDetails.labels}
    //     comments={cardForDetails.comments}
    //     position={cardForDetails.position}
    //     description={cardForDetails.description}
    //     closeDetails={closeDetails}
    //     id={cardId}
    //     columnTitle={columnsWithCards[columnId].title}
    //     columnId={columnId}
    //   />,
    // );
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
    for (const column in columnsWithCards) {
      cardForDetails = columnsWithCards[column].cards.find(card => card._id === cardIdDetails);

      if (cardForDetails) {
        cardForDetails = {
          ...cardForDetails,
          columnId: column,
          columnTitle: columnsWithCards[column].title,
        };
        break;
      }
    }
  }

  return (
    <ColumnListContext.Provider
      value={{
        columnsWithCards,
        handleError,
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
