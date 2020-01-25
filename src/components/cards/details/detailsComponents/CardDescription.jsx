import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../../../utils/TextInput';


const CardDescription = ({ description, handleUpdateRequest, discardChangesOnEscapePressed, blurOnShiftAndEnterPressed }) => {
  const [cardDescription, setCardDescription] = useState(description);

  const onDescriptionBlur = (e) => {
    if (description === e.target.value) return;

    const dataToUpdate = {
      description: cardDescription,
    };

    handleUpdateRequest(dataToUpdate);
  };

  const onDescriptionChange = (e) => {
    const { target } = e;
    setCardDescription(target.value);
  };

  return (
    <div className="card-details__description-wrap">
      <span className="font-weight-bold">DESCRIPTION</span>

      <div className="card-details__description-input-container">
        <TextInput
          hideSearchBtn
          hideCrossBtn
          inputType="textarea"
          name="card-description"
          inputValue={cardDescription}
          onChange={onDescriptionChange}
          onKeyDown={discardChangesOnEscapePressed(setCardDescription, description)}
          onKeyPress={blurOnShiftAndEnterPressed}
          onBlur={onDescriptionBlur}
          classList="w-100 py-2 card-details__description-input"
          placeholder="Add a more detailed description..."
        />
        <div className="card-details__description-buttons-container active">
          <button onClick={() => { }} type="button" className="bg-success text-white">Add</button>
          <button onClick={() => { }} type="button" className="close-input-btn">
            <FontAwesomeIcon className="add-icon" icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
};


CardDescription.propTypes = {

};


export default CardDescription;
