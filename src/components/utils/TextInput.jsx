import React, { Component } from 'react';
import '../../styles/searchInput.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

class TextInput extends Component {
  constructor(props) {
    super(props);

    this.inputElement = React.createRef();
    this.crossBtn = React.createRef();
    this.searchBtn = React.createRef();
  }

  componentDidMount() {
    const { props } = this;

    if (props.selectOnMounted) this.inputElement.current.select();
  }

  onFocus = (e) => {
    const { props } = this;

    this.searchBtn.current.classList.remove('active');
    this.crossBtn.current.classList.add('active');

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

  onSearchBtnClick = () => {
    this.inputElement.current.focus();
  }

  onCrossBtnClick = (e) => {
    const { props } = this;

    if (props.onCrossBtnClick) props.onCrossBtnClick(e);
    if (props.focusedAfterCleared) this.inputElement.current.focus();
  }

  render() {
    const emptyValue = '';
    const { props } = this;
    const {
      hideSearchBtn,
      hideCrossBtn,
      textColor = emptyValue,
      inputValue = emptyValue,
      onSearchBtnClick,
      onChange,
      placeholder,
      id,
      name,
      classList,
    } = props;

    const { onFocus, onBlur, onCrossBtnClick } = this;

    return (
      <div className="search-input-container position-relative">
        <input
          ref={this.inputElement}
          style={{ color: textColor }}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          type="text"
          className={`nav-link ${classList}`}
          placeholder={placeholder || 'Search'}
          value={inputValue}
          id={id || ''}
          name={name || ''}
        />

        <div ref={this.crossBtn} className={`icon-container ${inputValue && 'active'}`}>
          <FontAwesomeIcon style={{ display: hideCrossBtn ? 'none' : '' }} onClick={onCrossBtnClick} className="dropdown-search-icon clear-input-button" icon={faTimes} />
        </div>

        <div ref={this.searchBtn} className={`icon-container ${!inputValue && 'active'}`}>
          <FontAwesomeIcon style={{ display: hideSearchBtn ? 'none' : '' }} onClick={onSearchBtnClick} className="dropdown-search-icon search-button" icon={faSearch} />
        </div>
      </div>
    );
  }
}

export default TextInput;
