import React, { useRef, useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Draggable from '../utils/dragdrop/Draggable';
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


const Card = (props) => {
  const {
    index,
    token,
    board,
    cardData,
    columnId,
  } = props;

  const { cardId, cardTitle } = cardData;

  const editingTargetRef = useRef(null);

  const deleteCard = (e) => {
    if (e.nativeEvent.shiftKey) {
      props.deleteCard(token.token, board._id, cardId)
        .then(() => {

        });
    }
  };

  return (
    <Draggable containerId={columnId} draggableId={cardId} index={index} direction="vertical" type="card">
      {dragProvided => (
        <div {...dragProvided.draggableProps} ref={dragProvided.innerRef} className="card-drag-area drag-target">
          <div tabIndex="0" role="button" onKeyPress={deleteCard} onClick={deleteCard} {...dragProvided.dragHandleProps} className="card-item d-flex px-2 flex-wrap align-items-center drag-source">
            <div ref={editingTargetRef} className="h-100 w-100">
              <div className="title w-100">
                <span>{cardTitle}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};


Card.propTypes = propTypes;


const mapDispatchToProps = dispatch => ({
  deleteCard: (token, boardId, cardId) => dispatch(boardActions.deleteCard(token, boardId, cardId)),
});

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(Card), (prevProps, nextProps) => {
  const result = prevProps.columnId === nextProps.columnId
    && prevProps.cardTitle === nextProps.cardTitle
    && prevProps.cardData.cardPosition === nextProps.cardData.cardPosition
    && prevProps.cardData.cardTitle === nextProps.cardData.cardTitle
    && prevProps.index === nextProps.index;
  return result;
});
