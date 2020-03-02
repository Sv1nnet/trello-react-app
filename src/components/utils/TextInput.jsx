// React/Redux components
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Custom components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

// Utils
import resizeTextarea from '../../utlis/resizeTextarea';

// Styles
import '../../styles/textInput.sass';


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
  containerClassList: PropTypes.string,
  verticalPadding: PropTypes.number,
  focusAfterCleared: PropTypes.bool,
  focusAfterActivated: PropTypes.bool,
  onSearchBtnClick: PropTypes.func,
  selectOnMounted: PropTypes.bool,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
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
  containerClassList: '',
  verticalPadding: 0,
  focusAfterCleared: false, // whether input should be in focus after it was cleaned by cross button
  focusAfterActivated: false, // whether input should be in focus after it was mounted
  onSearchBtnClick: null,
  selectOnMounted: false,
  innerRef: null,
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

  state = {
    isInputElementActive: false,
  }

  componentDidMount() {
    const { props, inputElement } = this;
    const { inputType, focusAfterActivated, selectOnMounted, verticalPadding } = props;

    // set new size of textarea to fit its content
    if (inputType === 'textarea') {
      resizeTextarea(inputElement, verticalPadding);
    }

    if (focusAfterActivated) this.inputElement.current.focus();
    if (selectOnMounted) this.inputElement.current.select();
  }

  componentDidUpdate() {
    const { inputType, verticalPadding } = this.props;
    const { inputElement } = this;

    // set new size of textarea to fit its content
    if (inputType === 'textarea') {
      resizeTextarea(inputElement, verticalPadding);
    }
  }

  onFocus = (e) => {
    const { props } = this;
    const { hideCrossBtn, hideSearchBtn } = props;

    if (!(hideCrossBtn && hideSearchBtn)) {
      this.setState(() => ({
        isInputElementActive: true,
      }));
    }

    if (props.onFocus) props.onFocus(e);
  }

  onBlur = (e) => {
    const { props } = this;

    if (!props.inputValue) {
      this.setState(() => ({
        isInputElementActive: false,
      }));
    }

    if (props.onBlur) props.onBlur(e);
  }

  onKeyPress = (e) => {
    const { onKeyPress } = this.props;

    if (onKeyPress) onKeyPress(e);
  }

  onKeyDown = (e) => {
    const { onKeyDown } = this.props;

    if (onKeyDown) onKeyDown(e);
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
    const { props, inputElement } = this;
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
      innerRef,
    } = props;

    const {
      state,
      onFocus,
      onBlur,
      onKeyUp,
      onKeyPress,
      onKeyDown,
    } = this;

    const inputProps = {
      onChange,
      onFocus,
      onBlur,
      onKeyPress,
      onKeyDown,
      onKeyUp,
      ref: (ref) => {
        inputElement.current = ref;
        if (innerRef) innerRef.current = ref;
      },
      style: { color: textColor },
      type: 'text',
      className: `nav-link text-input ${classList} ${state.isInputElementActive ? 'text-input_btn-active active' : ''}`,
      placeholder: placeholder || 'Search',
      value: inputValue,
      maxLength,
      name,
    };

    if (id) {
      inputProps.id = id;
    }

    return inputType === 'input'
      ? (
        <input {...inputProps} />
      )
      : (
        <textarea {...inputProps} />
      );
  }

  render() {
    const emptyValue = '';
    const { props } = this;
    const {
      hideSearchBtn,
      hideCrossBtn,
      inputValue = emptyValue,
      containerClassList,
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
      <div className={`text-input-container position-relative ${containerClassList}`}>
        {input}

        <div ref={this.crossBtn} className={`text-input__icon-container ${crossBtnActive}`}>
          <FontAwesomeIcon style={{ display: hideCrossBtn ? 'none' : '' }} onClick={onCrossBtnClick} className="text-input__icon clear-input-button" icon={faTimes} />
        </div>

        <div ref={this.searchBtn} className={`text-input__icon-container ${searchBtnActive}`}>
          <FontAwesomeIcon style={{ display: hideSearchBtn ? 'none' : '' }} onClick={onSearchBtnClick} className="text-input__icon search-button" icon={faSearch} />
        </div>
      </div>
    );
  }
}


TextInput.defaultProps = defaultProps;
TextInput.propTypes = propTypes;


export default TextInput;
