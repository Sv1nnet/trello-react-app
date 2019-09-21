import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import hasParent from '../../utlis/hasParent';
import TextInput from './TextInput';


const proptTypes = {
  addContent: PropTypes.func.isRequired,
  openBtnTitle: PropTypes.string.isRequired,
  openBtnWrapperClass: PropTypes.string,
  addBtnTitle: PropTypes.string.isRequired,
  containerClass: PropTypes.string,
  addBtnClass: PropTypes.string,
  textInputOptions: PropTypes.shape({
    textInputName: PropTypes.string.isRequired,
    textInputId: PropTypes.string.isRequired,
    textInputClass: PropTypes.string.isRequired,
    textInputPlaceholder: PropTypes.string.isRequired,
  }).isRequired,
};

const defaultProps = {
  openBtnWrapperClass: '',
  containerClass: '',
  addBtnClass: '',
};


const AddBoardContent = (props) => {
  const {
    addContent,
    openBtnTitle,
    openBtnWrapperClass,
    addBtnTitle,
    containerClass,
    addBtnClass,
    textInputOptions,
  } = props;

  const {
    textInputName,
    textInputId,
    textInputClass,
    textInputPlaceholder,
  } = textInputOptions;

  const [addContentState, setAddCardState] = useState({
    inputActive: false,
    contentTitle: '',
  });

  const addContentContainerRef = useRef(null);

  const closeAddContentInput = (e, shouldClose) => {
    if (e) e.preventDefault();

    if (shouldClose || !hasParent(addContentContainerRef.current, e.target)) {
      window.removeEventListener('click', closeAddContentInput);

      setAddCardState({
        inputActive: false,
        contentTitle: '',
      });
    }
  };

  const openCreateContentInput = (e) => {
    e.preventDefault();

    setAddCardState({
      ...addContentState,
      inputActive: true,
    });

    window.addEventListener('click', closeAddContentInput);
  };

  const clearInput = () => {
    setAddCardState({
      ...addContentState,
      contentTitle: '',
    });
  };

  const handleChange = (e) => {
    const { target } = e;
    setAddCardState({
      ...addContentState,
      contentTitle: target.value,
    });
  };

  const handleAddContent = (e) => {
    addContent(e, addContentState.contentTitle)
      .then((res) => {
        closeAddContentInput(null, true);
      });
  };

  const handleKeyUp = (e) => {
    if (e.nativeEvent.charCode === 13 || e.nativeEvent.key === 'Enter') {
      addContent(e, addContentState.contentTitle)
        .then((res) => {
          closeAddContentInput(null, true);
        });
    }

    if (e.nativeEvent.keyCode === 27 || e.nativeEvent.key === 'Escape') {
      closeAddContentInput(null, true);
    }
  };

  return (
    <div ref={addContentContainerRef} className={containerClass}>
      {
        addContentState.inputActive
          ? (
            <>
              <TextInput
                type="text"
                name={textInputName}
                id={textInputId}
                classList={`w-100 ${textInputClass}`}
                placeholder={textInputPlaceholder}
                onChange={handleChange}
                onKeyUp={handleKeyUp}
                onCrossBtnClick={clearInput}
                inputValue={addContentState.contentTitle}
                focusAfterActivated
                focusAfterCleared
                hideSearchBtn
              />

              <div className="buttons-container">
                <button onClick={handleAddContent} type="button" className={`bg-success text-white ${addBtnClass}`}>{addBtnTitle}</button>
                <button onClick={(e) => { closeAddContentInput(e, true); }} type="button" className="close-input-btn">
                  <FontAwesomeIcon className="add-icon" icon={faTimes} />
                </button>
              </div>
            </>
          )
          : (
            <div className={`${openBtnWrapperClass || ''} py-0`}>
              <a onClick={openCreateContentInput} href="/" className="btn btn-sm btn-block">
                <FontAwesomeIcon className="add-icon" icon={faPlus} />
                <span>{openBtnTitle}</span>
              </a>
            </div>
          )
      }
    </div>
  );
};


AddBoardContent.propTypes = proptTypes;
AddBoardContent.defaultProps = defaultProps;


export default AddBoardContent;
