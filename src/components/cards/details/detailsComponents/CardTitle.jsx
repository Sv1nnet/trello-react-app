import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextInput from '../../../utils/TextInput';
import PopupContainer from '../../../utils/PopupContainer';
import isEnterPressed from '../../../../utlis/isEnterPressed';


const CardTitle = (props) => {
  const {
    title,
    columnTitle,
    handleUpdateRequest,
    discardChangesOnEscapePressed,
    blurOnShiftAndEnterPressed,
    setMoveCardPopupState,
    moveCardPopupIsActive,
    getPopupContainerPosition,
  } = props;

  const [cardTitle, setCardTitle] = useState(title);

  const onTitleChange = (e) => {
    const { target } = e;

    // Prevent from adding new line in card title
    if (isEnterPressed(e)) {
      e.preventDefault();
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
          </a>
        )}

        {moveCardPopupIsActive && (
          <PopupContainer
            removeElement={setMoveCardPopupState}
            closeBtn
            extraClasses={['card-details__move-card-popup']}
            style={getPopupContainerPosition(document.querySelector('.column-title > a'), { paddingTop: 17 })}
          >
            <span className="popup-title">Move Card</span>
          </PopupContainer>
        )}
      </div>
    </div>
  );
};


CardTitle.propTypes = {

};


export default CardTitle;
