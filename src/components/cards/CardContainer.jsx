import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Draggable from '../utils/dragdrop/Draggable';
import Card from './Card';
import CardDetails from './details/CardDetails';
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
    columnTitle,
  } = props;

  const {
    id,
    title,
    labels,
    comments,
    description,
  } = cardData;

  const [detailsOpened, setDetailsOpened] = useState(false);
  const editingTargetRef = useRef(null);

  const openDetails = () => {
    setDetailsOpened(true);
  };

  const closeDetails = (e) => {
    setDetailsOpened(false);
  };

  const deleteCard = (e) => {
    if (e.nativeEvent.shiftKey) {
      props.deleteCard(token.token, board._id, id)
        .then(() => {

        });
    } else {
      openDetails();
    }
  };

  return (
    <>
      <Draggable containerId={columnId} draggableId={id} index={index} direction="vertical" type="card">
        {dragProvided => (
          <Card
            openDetails={openDetails}
            dragProvided={dragProvided}
            deleteCard={deleteCard}
            editingTargetRef={editingTargetRef}
            title={title}
          />
        )}
      </Draggable>
      {detailsOpened && ReactDOM.createPortal(<CardDetails
        title={title}
        labels={labels}
        comments={comments}
        description={description}
        closeDetails={closeDetails}
        id={id}
        columnTitle={columnTitle}
      />, document.querySelector('.App'))}
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

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(CardContainer), (prevProps, nextProps) => {
  const result = prevProps.columnId === nextProps.columnId
    && prevProps.title === nextProps.title
    && prevProps.cardData.description === nextProps.cardData.description
    && prevProps.cardData.cardPosition === nextProps.cardData.cardPosition
    && prevProps.cardData.title === nextProps.cardData.title
    && prevProps.index === nextProps.index;
  return result;
});
