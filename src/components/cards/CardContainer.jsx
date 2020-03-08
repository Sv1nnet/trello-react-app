// React/Redux components
import React, { useRef, useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Custom components
import Draggable from '../utils/dragdrop/Draggable';
import Card from './Card';
import Messages from '../utils/Messages';

// Context
import { BoardContentContext } from '../context/BoardContentContext';

// Custom hooks
import useStatus from '../../utlis/hooks/useStatus';

// mapState and action
import { mapStateToProps } from '../../utlis/reduxMapFunction';
import boardActions from '../../actions/boardActions';

// Styles
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

  const [questionIsActive, setQuestionIsActive] = useState(false);
  const {
    status,
    setStatusLoading,
    resetStatus,
    handleError,
  } = useStatus();

  const { openDetails, moveCard } = useContext(BoardContentContext);
  const editingTargetRef = useRef(null);

  const deleteCard = (e) => {
    e.stopPropagation();
    setQuestionIsActive(true);
  };

  const onCardClick = () => {
    openDetails(id);
  };

  const positiveAnswer = () => {
    setStatusLoading();

    props.deleteCard(token.token, board._id, id)
      .catch((err) => {
        handleError(err);
        setQuestionIsActive(false);
      });
  };

  const negativeAnswer = () => {
    setQuestionIsActive(false);
  };

  return (
    <>
      <Draggable dragHandlers={{ onDragEnd: moveCard }} containerId={columnId} draggableId={id} index={index} direction="vertical" type="card">
        {dragProvided => (
          <Card
            openDetails={openDetails}
            dragProvided={dragProvided || null}
            onClick={onCardClick}
            deleteCard={deleteCard}
            editingTargetRef={editingTargetRef}
            title={title}
            labels={labels}
          />
        )}
      </Draggable>

      {questionIsActive && ReactDOM.createPortal(
        <Messages.QuestionMessage type="error" answer={{ positive: positiveAnswer, negative: negativeAnswer }} message={`Delete the card ${title}`} />,
        document.body,
      )}

      {status.err.message && ReactDOM.createPortal(
        <Messages.ErrorMessage btn message={status.err.message} closeMessage={resetStatus} />,
        document.body,
      )}
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  deleteCard: (token, boardId, id) => dispatch(boardActions.deleteCard(token, boardId, id)),
});


CardContainer.propTypes = propTypes;


export default React.memo(connect(mapStateToProps.mapRequestData, mapDispatchToProps)(CardContainer));
