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


const CardTitle = (props) => {
  const {
    title,
    columnTitle,
    columnId,
    position,
    handleUpdateRequest,
    discardChangesOnEscapePressed,
    blurOnShiftAndEnterPressed,
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

  const onTitleChange = (e) => {
    const { target } = e;

    // Send send change request if user pressed Enter
    if (isEnterPressed(e)) {
      e.preventDefault();
      target.blur();
      return;
    }

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
        onChange={onTitleChange}
        onKeyDown={discardChangesOnEscapePressed(setCardTitle, title)}
        onKeyPress={blurOnShiftAndEnterPressed}
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
            extraClasses={['card-details__move-card-popup']}
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


CardTitle.propTypes = {

};


export default CardTitle;
