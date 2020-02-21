import React, { useRef, useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Draggable from '../utils/dragdrop/Draggable';
import Card from './Card';
import boardActions from '../../actions/boardActions';
import '../../styles/cardItem.sass';
import { BoardContentContext } from '../context/BoardContentContext';
import Messages from '../utils/Messages';
import useStatus from '../../utlis/hooks/useStatus';
import hasParent from '../../utlis/hasParent';


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

  const { openDetails, switchCards } = useContext(BoardContentContext);
  const editingTargetRef = useRef(null);
  const deleteButtonRef = useRef(null);

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
      <Draggable dragHandlers={{ onDragEnd: switchCards }} containerId={columnId} draggableId={id} index={index} direction="vertical" type="card">
        {dragProvided => (
          <Card
            openDetails={openDetails}
            dragProvided={dragProvided || null}
            onClick={onCardClick}
            deleteCard={deleteCard}
            editingTargetRef={editingTargetRef}
            deleteButtonRef={deleteButtonRef}
            title={title}
            labels={labels}
          />
        )}
      </Draggable>

      {questionIsActive && ReactDOM.createPortal(
        <Messages.QuestionMessage type="error" answer={{ positive: positiveAnswer, negative: negativeAnswer }} message={`Delete the card ${title}`} />,
        document.querySelector('.App'),
      )}

      {status.err.message && ReactDOM.createPortal(
        <Messages.ErrorMessage btn message={status.err.message} closeMessage={resetStatus} />,
        document.querySelector('.App'),
      )}
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
