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
    textInputType: PropTypes.string,
  }).isRequired,
};

const defaultProps = {
  openBtnWrapperClass: '',
  containerClass: '',
  addBtnClass: '',
};

/**
 * Allows to add column or card
 * @param {Object} props component's props
 * @returns {Component} rendered React component
 */
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
    textInputType,
  } = textInputOptions;

  const [addContentState, setAddContentState] = useState({
    inputActive: false,
    contentTitle: '',
  });

  const addContentContainerRef = useRef(null);

  const closeAddContentInput = (e, shouldClose) => {
    if (shouldClose || !hasParent(addContentContainerRef.current, e.target)) {
      if (e) e.preventDefault();
      window.removeEventListener('mousedown', closeAddContentInput);

      setAddContentState({
        inputActive: false,
        contentTitle: '',
      });
    }
  };

  const openCreateContentInput = (e) => {
    e.preventDefault();

    setAddContentState({
      ...addContentState,
      inputActive: true,
    });

    window.addEventListener('mousedown', closeAddContentInput);
  };

  const clearInput = () => {
    setAddContentState({
      ...addContentState,
      contentTitle: '',
    });
  };

  const onChange = (e) => {
    const { target } = e;

    // Prevent from adding new line in card title
    if (target.value[target.value.length - 1] && target.value[target.value.length - 1].charCodeAt(0) === 10) {
      e.preventDefault();
      return;
    }

    setAddContentState({
      ...addContentState,
      contentTitle: target.value,
    });
  };

  const onAddContent = (e) => {
    addContent(e, addContentState.contentTitle)
      .then(() => {
        closeAddContentInput(null, true);
      });
  };

  const onKeyUp = (e) => {
    if (e.nativeEvent.charCode === 13 || e.nativeEvent.key === 'Enter') {
      addContent(e, addContentState.contentTitle)
        .then(() => {
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
                inputType={textInputType || 'input'}
                maxLength="128"
                verticalPadding={2}
                name={textInputName}
                id={textInputId}
                classList={`w-100 ${textInputClass}`}
                placeholder={textInputPlaceholder}
                onChange={onChange}
                onKeyUp={onKeyUp}
                onCrossBtnClick={clearInput}
                inputValue={addContentState.contentTitle}
                focusAfterActivated
                focusAfterCleared
                hideSearchBtn
                hideCrossBtn
              />

              <div className="buttons-container">
                <button onClick={onAddContent} type="button" className={`bg-success text-white ${addBtnClass}`}>{addBtnTitle}</button>
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
