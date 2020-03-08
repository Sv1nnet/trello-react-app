// React/Redux components
import React, { useState, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// Custom components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareSquare } from '@fortawesome/free-solid-svg-icons';
import MoveCardPopup from './MoveCardPopup';
import Messages from '../../../utils/Messages';
import TextInput from '../../../utils/TextInput';

// Context
import { BoardContentContext } from '../../../context/BoardContentContext';

// Utils
import useStatus from '../../../../utlis/hooks/useStatus';
import isEnterPressed from '../../../../utlis/isEnterPressed';


const propTypes = {
  title: PropTypes.string.isRequired,
  columnTitle: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  handleUpdateRequest: PropTypes.func.isRequired,
  discardChangesOnEscapePressed: PropTypes.func.isRequired,
  setMoveCardPopupState: PropTypes.func.isRequired,
  moveCardPopupIsActive: PropTypes.bool.isRequired,
  getPopupContainerPosition: PropTypes.func.isRequired,
};


const CardTitle = (props) => {
  const {
    title,
    columnTitle,
    columnId,
    position,
    deleteCard,
    handleUpdateRequest,
    discardChangesOnEscapePressed,
    setMoveCardPopupState,
    moveCardPopupIsActive,
    getPopupContainerPosition,
  } = props;

  const [cardTitle, setCardTitle] = useState(title);
  const columnTitleBtnRef = useRef();
  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const { moveCard: moveCardToNewPosition } = useContext(BoardContentContext);

  const onKeyPress = (e) => {
    const { target } = e;

    // Send change request if user pressed Enter
    if (isEnterPressed(e)) {
      e.preventDefault();
      target.blur();
    }
  };

  const onTitleChange = (e) => {
    const { target } = e;

    setCardTitle(target.value);
  };

  const onTitleBlur = (e) => {
    if (title === e.target.value) return;

    const dataToUpdate = {
      title: cardTitle,
    };

    handleUpdateRequest(dataToUpdate);
  };

  const moveCard = (target) => {
    const source = {
      containerId: columnId,
      index: position,
    };

    setStatusLoading();

    moveCardToNewPosition(source, target)
      .then(handleSuccess)
      .catch(handleError);
  };

  return (
    <div className="w-100">
      <TextInput
        hideSearchBtn
        hideCrossBtn
        inputType="textarea"
        name="card-title"
        maxLength="128"
        inputValue={cardTitle}
        onKeyPress={onKeyPress}
        onChange={onTitleChange}
        onKeyDown={discardChangesOnEscapePressed(setCardTitle, title)}
        onBlur={onTitleBlur}
        verticalPadding={2}
        classList="card-details__title-input font-weight-bold"
      />
      <div className="column-title">
        in list {(
          <a ref={columnTitleBtnRef} href="/" onClick={setMoveCardPopupState}>
            {columnTitle}
            <FontAwesomeIcon className="ml-2 move-card-icon" icon={faShareSquare} />
          </a>
        )}

        {moveCardPopupIsActive && (
          <MoveCardPopup
            removeElement={setMoveCardPopupState}
            style={getPopupContainerPosition(columnTitleBtnRef.current, { paddingTop: 17 })}
            sourceColumnId={columnId}
            sourcePosition={position}
            moveCard={moveCard}
            deleteCard={deleteCard}
          />
        )}
      </div>

      {status.err.message && ReactDOM.createPortal(
        <Messages.ErrorMessage message={status.err.message} closeBtn closeMessage={resetStatus} />,
        document.body,
      )}
    </div>
  );
};


CardTitle.propTypes = propTypes;


export default CardTitle;
