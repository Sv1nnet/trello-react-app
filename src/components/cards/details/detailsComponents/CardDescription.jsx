import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../../../utils/TextInput';


const propTypes = {
  description: PropTypes.string,
  handleUpdateRequest: PropTypes.func.isRequired,
  discardChangesOnEscapePressed: PropTypes.func.isRequired,
  blurOnShiftAndEnterPressed: PropTypes.func.isRequired,
};

const defaultProps = {
  description: '',
};


const CardDescription = (props) => {
  const {
    description,
    handleUpdateRequest,
    discardChangesOnEscapePressed,
    blurOnShiftAndEnterPressed,
  } = props;

  const [cardDescription, setCardDescription] = useState(description);
  const [buttonsActive, setButtonsActive] = useState(false);

  const inputRef = useRef(null);

  const onDescriptionBlur = (e) => {
    setButtonsActive(false);

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

  const onFocus = () => {
    setButtonsActive(true);
  };

  const discardDescriptionChanges = () => {
    setCardDescription(description);
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
          innerRef={inputRef}
          inputValue={cardDescription}
          onFocus={onFocus}
          onChange={onDescriptionChange}
          onKeyDown={discardChangesOnEscapePressed(setCardDescription, description)}
          onKeyPress={blurOnShiftAndEnterPressed}
          onBlur={onDescriptionBlur}
          classList="w-100 py-2 card-details__description-input"
          placeholder="Add a more detailed description..."
        />
        <div className={`card-details__description-buttons-container ${buttonsActive ? 'active' : ''}`}>
          <button onClick={() => { inputRef.current.blur(); }} type="button" className="bg-success text-white">Add</button>
          <button onMouseDown={discardDescriptionChanges} type="button" className="discard-btn">
            <FontAwesomeIcon className="close-icon" icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
};


CardDescription.propTypes = propTypes;
CardDescription.defaultProps = defaultProps;


export default CardDescription;
