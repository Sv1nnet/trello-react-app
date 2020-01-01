import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../styles/searchInput.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import resizeTextarea from '../../utlis/resizeTextarea';


const propTypes = {
  hideSearchBtn: PropTypes.bool,
  hideCrossBtn: PropTypes.bool,
  inputType: PropTypes.string,
  textColor: PropTypes.string,
  inputValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxLength: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  classList: PropTypes.string,
  focusAfterCleared: PropTypes.bool,
  focusAfterActivated: PropTypes.bool,
};

const defaultProps = {
  hideSearchBtn: false, // don't display search button
  hideCrossBtn: false, // don't display cross (clear input field) button
  inputType: 'input', // type of input HTML element (input or textarea)
  textColor: '', // color of input text
  placeholder: '',
  maxLength: '', // max length for textarea element
  id: '',
  name: '',
  classList: '', // list of extra classes
  focusAfterCleared: false, // whether input should be in focus after it was cleaned by cross button
  focusAfterActivated: false, // whether input should be in focus after it was mounted
};

// Input component to input text for search or create a card, column, etc.
// Can be input or textarea HTML element.
class TextInput extends Component {
  constructor(props) {
    super(props);

    this.inputElement = React.createRef();
    this.crossBtn = React.createRef();
    this.searchBtn = React.createRef();
  }

  componentDidMount() {
    const { props, inputElement } = this;
    const { inputType, focusAfterActivated, selectOnMounted } = props;

    // set new size of textarea to fit its content
    if (inputType === 'textarea') {
      resizeTextarea(inputElement);
    }

    if (focusAfterActivated) this.inputElement.current.focus();
    if (selectOnMounted) this.inputElement.current.select();
  }

  componentDidUpdate() {
    const { inputType } = this.props;
    const { inputElement } = this;

    // set new size of textarea to fit its content
    if (inputType === 'textarea') {
      resizeTextarea(inputElement);
    }
  }

  onFocus = (e) => {
    const { props } = this;

    if (props.inputValue || (!props.inputValue && props.hideSearchBtn)) {
      this.searchBtn.current.classList.remove('active');
      this.crossBtn.current.classList.add('active');
    }

    if (props.onFocus) props.onFocus(e);
  }

  onBlur = (e) => {
    const { props } = this;

    if (!props.inputValue) {
      this.searchBtn.current.classList.add('active');
      this.crossBtn.current.classList.remove('active');
    }

    if (props.onBlur) props.onBlur(e);
  }

  onKeyPress = (e) => {
    const { onKeyPress } = this.props;

    if (onKeyPress) onKeyPress(e);
  }

  onKeyUp = (e) => {
    const { onKeyUp } = this.props;

    if (onKeyUp) onKeyUp(e);
  }

  onSearchBtnClick = () => {
    const { props } = this;

    if (props.onSearchBtnClick) props.onSearchBtnClick();
    this.inputElement.current.focus();
  }

  onCrossBtnClick = (e) => {
    const { props } = this;

    if (props.onCrossBtnClick) props.onCrossBtnClick(e);
    if (props.focusAfterCleared) this.inputElement.current.focus();
  }

  getInput = () => {
    const emptyValue = '';
    const { props } = this;
    const {
      inputType,
      textColor = emptyValue,
      inputValue = emptyValue,
      onChange,
      placeholder,
      id,
      name,
      classList,
      maxLength,
    } = props;

    const {
      onFocus,
      onBlur,
      onKeyUp,
      onKeyPress,
    } = this;

    return inputType === 'input'
      ? (
        <input
          ref={this.inputElement}
          style={{ color: textColor }}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
          onKeyUp={onKeyUp}
          type="text"
          className={`nav-link ${classList}`}
          placeholder={placeholder || 'Search'}
          value={inputValue}
          id={id}
          name={name}
        />
      )
      : (
        <textarea
          ref={this.inputElement}
          style={{ color: textColor }}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
          onKeyUp={onKeyUp}
          type="text"
          className={`nav-link ${classList}`}
          placeholder={placeholder || 'Search'}
          value={inputValue}
          id={id}
          name={name}
          maxLength={maxLength}
        />
      );
  }

  render() {
    const emptyValue = '';
    const { props } = this;
    const {
      hideSearchBtn,
      hideCrossBtn,
      inputValue = emptyValue,
    } = props;

    const {
      getInput,
      onCrossBtnClick,
      onSearchBtnClick,
    } = this;

    const crossBtnActive = inputValue ? 'active' : '';
    const searchBtnActive = !inputValue ? 'active' : '';
    const input = getInput();

    return (
      <div className="search-input-container position-relative">
        {input}

        <div ref={this.crossBtn} className={`icon-container ${crossBtnActive}`}>
          <FontAwesomeIcon style={{ display: hideCrossBtn ? 'none' : '' }} onClick={onCrossBtnClick} className="dropdown-search-icon clear-input-button" icon={faTimes} />
        </div>

        <div ref={this.searchBtn} className={`icon-container ${searchBtnActive}`}>
          <FontAwesomeIcon style={{ display: hideSearchBtn ? 'none' : '' }} onClick={onSearchBtnClick} className="dropdown-search-icon search-button" icon={faSearch} />
        </div>
      </div>
    );
  }
}


TextInput.defaultProps = defaultProps;
TextInput.propTypes = propTypes;


export default TextInput;
