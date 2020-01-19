import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Draggable from '../utils/dragdrop/Draggable';
import Card from './Card';
import CardDetails from './CardDetails';
import boardActions from '../../actions/boardActions';
import '../../styles/cardItem.sass';


const propTypes = {
  index: PropTypes.number.isRequired,
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  cardData: PropTypes.shape({
    cardId: PropTypes.string.isRequired,
    cardTitle: PropTypes.string.isRequired,
  }).isRequired,
  columnId: PropTypes.string.isRequired,
};


const CardContainer = (props) => {
  const {
    index,
    token,
    board,
    cardData,
    columnId,
    columnTitle,
  } = props;

  const {
    cardId,
    cardTitle,
    marks,
    comments,
    description,
  } = cardData;

  const [detailsOpened, setDetailsOpened] = useState(false);
  const editingTargetRef = useRef(null);

  const openDetails = () => {
    setDetailsOpened(true);
  };

  const closeDetails = () => {
    setDetailsOpened(false);
  };

  const deleteCard = (e) => {
    if (e.nativeEvent.shiftKey) {
      props.deleteCard(token.token, board._id, cardId)
        .then(() => {

        });
    } else {
      openDetails();
    }
  };

  return (
    <>
      <Draggable containerId={columnId} draggableId={cardId} index={index} direction="vertical" type="card">
        {dragProvided => (
          <Card
            openDetails={openDetails}
            dragProvided={dragProvided}
            deleteCard={deleteCard}
            editingTargetRef={editingTargetRef}
            cardTitle={cardTitle}
          />
        )}
      </Draggable>
      {detailsOpened && ReactDOM.createPortal(<CardDetails
        title={cardTitle}
        marks={marks}
        comments={comments}
        description={description}
        closeDetails={closeDetails}
        cardId={cardId}
        columnTitle={columnTitle}
      />, document.querySelector('.App'))}
    </>
  );
};


CardContainer.propTypes = propTypes;


const mapDispatchToProps = dispatch => ({
  deleteCard: (token, boardId, cardId) => dispatch(boardActions.deleteCard(token, boardId, cardId)),
});

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(CardContainer), (prevProps, nextProps) => {
  const result = prevProps.columnId === nextProps.columnId
    && prevProps.cardTitle === nextProps.cardTitle
    && prevProps.cardData.cardPosition === nextProps.cardData.cardPosition
    && prevProps.cardData.cardTitle === nextProps.cardData.cardTitle
    && prevProps.index === nextProps.index;
  return result;
});
