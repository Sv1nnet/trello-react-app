import React, { useRef, useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Draggable from '../utils/dragdrop/Draggable';
import Card from './Card';
import boardActions from '../../actions/boardActions';
import '../../styles/cardItem.sass';
import { BoardContentContext } from '../context/BoardContentContext';


const propTypes = {
  index: PropTypes.number.isRequired,
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  cardData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
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
  } = props;

  const {
    id,
    title,
    labels,
  } = cardData;

  const { openDetails, switchCards } = useContext(BoardContentContext);
  const editingTargetRef = useRef(null);

  const deleteCard = (e) => {
    if (e.nativeEvent.shiftKey) {
      props.deleteCard(token.token, board._id, id)
        .then(() => {

        });
    } else {
      openDetails(id);
    }
  };

  return (
    <>
      <Draggable dragHandlers={{ onDragEnd: switchCards }} containerId={columnId} draggableId={id} index={index} direction="vertical" type="card">
        {dragProvided => (
          <Card
            openDetails={openDetails}
            dragProvided={dragProvided}
            deleteCard={deleteCard}
            editingTargetRef={editingTargetRef}
            title={title}
            labels={labels}
          />
        )}
      </Draggable>
    </>
  );
};


CardContainer.propTypes = propTypes;


const mapDispatchToProps = dispatch => ({
  deleteCard: (token, boardId, id) => dispatch(boardActions.deleteCard(token, boardId, id)),
});

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(CardContainer));
