import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import boardActions from '../../../../actions/boardActions';
import TextInput from '../../../utils/TextInput';
import useStatus from '../../../../utlis/hooks/useStatus';
import Messages from '../../../utils/Messages';
import isEnterPressed from '../../../../utlis/isEnterPressed';


const propTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  colorName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  updateLabel: PropTypes.func.isRequired,
};


const LabelCheckbox = (props) => {
  const {
    id,
    color,
    colorName,
    title,
    checked,
    onChange,
    board,
    token,
    updateLabel,
  } = props;

  const [labelTitle, setLabelTitle] = useState(title);
  const [isInputActive, setIsInputActive] = useState(false);
  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const setInputState = () => {
    setIsInputActive(prevState => !prevState);
  };

  const saveLabelTitleChanges = (e) => {
    e.preventDefault();

    if (labelTitle === title) {
      setIsInputActive(false);
      return;
    }

    setStatusLoading();

    updateLabel(token.token, board._id, id, { title: labelTitle })
      .then(handleSuccess)
      .then(() => { setIsInputActive(false); })
      .catch(handleError);
  };

  const onLabelTitleChange = (e) => {
    const { target } = e;

    setLabelTitle(target.value);
  };

  const onKeyPress = (e) => {
    if (isEnterPressed(e)) {
      e.preventDefault();
      saveLabelTitleChanges(e);
    }
  };

  const discardTitleChanges = () => {
    setIsInputActive(false);
    setLabelTitle(title);
  };

  return (
    <>
      <div className="color-label-checkbox__container">
        <label htmlFor={id} style={{ backgroundColor: color }} className="color-checkbox-label">{isInputActive ? '' : labelTitle}</label>
        {isInputActive && (
          <TextInput
            hideCrossBtn
            hideSearchBtn
            focusAfterActivated
            onKeyPress={onKeyPress}
            onChange={onLabelTitleChange}
            inputType="input"
            placeholder="Label title..."
            inputValue={labelTitle}
            containerClassList="label-title-input__container"
            classList="label-title-input"
          />
        )}
        <input type="checkbox" onChange={onChange} checked={checked} name={colorName} id={id} className="color-checkbox" />

        {!isInputActive && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
        {isInputActive && (
          <FontAwesomeIcon
            icon={faSave}
            onClick={!status.loading ? saveLabelTitleChanges : () => { }}
            onKeyPress={!status.loading ? saveLabelTitleChanges : () => { }}
            style={{ opacity: status.loading ? '0.3' : '1' }}
            className="save-icon"
          />
        )}

        {!isInputActive && <FontAwesomeIcon icon={faEdit} onClick={setInputState} onKeyPress={setInputState} className="edit-icon" />}
        {isInputActive && <FontAwesomeIcon icon={faTimes} onClick={discardTitleChanges} onKeyPress={discardTitleChanges} className="close-edit-icon" />}
      </div>
      {status.err.message && ReactDOM.createPortal(
        <Messages.ErrorMessage
          closeMessage={resetStatus}
          message={status.err.message}
          btn
        />,
        document.querySelector('.App'),
      )}
    </>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  updateLabel: (token, boardId, labelId, data) => dispatch(boardActions.updateLabel(token, boardId, labelId, data)),
});


LabelCheckbox.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(LabelCheckbox);
