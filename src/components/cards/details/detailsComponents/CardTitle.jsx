import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareSquare } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../../../utils/TextInput';
import PopupContainer from '../../../utils/PopupContainer';
import isEnterPressed from '../../../../utlis/isEnterPressed';
import MoveCardForm from './MoveCardForm';
import { BoardContentContext } from '../../../context/BoardContentContext';
import useStatus from '../../../../utlis/hooks/useStatus';
import Messages from '../../../utils/Messages';


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
    handleUpdateRequest,
    discardChangesOnEscapePressed,
    setMoveCardPopupState,
    moveCardPopupIsActive,
    getPopupContainerPosition,
  } = props;

  const [cardTitle, setCardTitle] = useState(title);
  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const { switchCards } = useContext(BoardContentContext);

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

    switchCards(source, target)
      .then(handleSuccess)
      .catch(handleError);
  };

  return (
    <div className="card-title-container w-100">
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
          <a href="/" onClick={setMoveCardPopupState}>
            {columnTitle}
            <FontAwesomeIcon className="ml-2 move-card-icon" icon={faShareSquare} />
          </a>
        )}

        {moveCardPopupIsActive && (
          <PopupContainer
            removeElement={setMoveCardPopupState}
            closeBtn
            extraClasses={['card-details__popup']}
            style={getPopupContainerPosition(document.querySelector('.column-title > a'), { paddingTop: 17 })}
          >
            <MoveCardForm
              sourceColumnId={columnId}
              sourcePosition={position}
              moveCard={moveCard}
            />
          </PopupContainer>
        )}
      </div>

      {status.err.message && ReactDOM.createPortal(
        <Messages.ErrorMessage message={status.err.message} closeBtn closeMessage={resetStatus} />,
        document.querySelector('.App'),
      )}
    </div>
  );
};


CardTitle.propTypes = propTypes;


export default CardTitle;
