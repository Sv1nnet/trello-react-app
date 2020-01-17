import React from 'react';
import PropTypes from 'prop-types';


const propTypes = {
  dragProvided: PropTypes.shape({
    dragHandleProps: PropTypes.shape({
      ref: PropTypes.shape({
        current: PropTypes.instanceOf(Element),
      }).isRequired,
      onMouseDown: PropTypes.func.isRequired,
    }).isRequired,
    draggableProps: PropTypes.shape({
      onMouseEnter: PropTypes.func.isRequired,
      key: PropTypes.string.isRequired,
      'data-draggable-id': PropTypes.string.isRequired,
      'data-draggable-index': PropTypes.number.isRequired,
      'data-draggable-direction': PropTypes.string.isRequired,
      'data-draggable-type': PropTypes.string,
    }).isRequired,
    innerRef: PropTypes.shape({
      current: PropTypes.instanceOf(Element),
    }).isRequired,
  }),
  deleteCard: PropTypes.func,
  editingTargetRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  cardTitle: PropTypes.string.isRequired,
};

const defaultProps = {
  dragProvided: null,
  deleteCard: null,
  editingTargetRef: null,
};


// We need ot separate card's body and its container because in search popup we shows cards withour draggable functionality
const Card = ({ dragProvided, deleteCard, editingTargetRef, cardTitle }) => {
  const dragHandleProps = dragProvided ? dragProvided.dragHandleProps : {};
  const cardBody = (
    <div tabIndex="0" role="button" onKeyPress={deleteCard} onClick={deleteCard} {...dragHandleProps} className="card-item d-flex px-2 flex-wrap align-items-center drag-source">
      <div ref={editingTargetRef} className="h-100 w-100">
        <div className="title w-100">
          <span>{cardTitle}</span>
        </div>
      </div>
    </div>
  );

  return dragProvided
    ? (
      <div {...dragProvided.draggableProps} ref={dragProvided.innerRef} className="card-drag-area drag-target">
        {cardBody}
      </div>
    )
    : (
      <div className="card-drag-area">
        {cardBody}
      </div>
    );
};


Card.propTypes = propTypes;
Card.defaultProps = defaultProps;


export default Card;
