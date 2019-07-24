/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThList, faHome } from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../utils/SearchInput';
import '../../styles/navbar.sass';

class UserNavbar extends Component {
  constructor(props) {
    super(props);

    this.searchBar = React.createRef();
    this.navSearchInput = React.createRef();
    this.searchCardsInput = React.createRef();
    this.boardsBar = React.createRef();
  }

  state = {
    searchText: '',

  }

  handleFocus = (e) => {
    if (window.getComputedStyle(e.target).display !== 'none') {
      e.target.classList.add('active');
      this.searchBar.current.classList.add('active');
    }
  }

  handleBlur = (e) => {
    if (!e.target.value) {
      e.target.classList.remove('active');
      this.searchBar.current.classList.remove('active');
    }
  }

  clearInput = () => {
    const { navSearchInput, searchCardsInput } = this;
    this.setState(state => ({
      ...state,
      searchText: '',
    }),
    () => {
      if (getComputedStyle(navSearchInput.current.inputElement.current).display !== 'none') navSearchInput.current.inputElement.current.focus();
      if (getComputedStyle(searchCardsInput.current.inputElement.current).display !== 'none') searchCardsInput.current.inputElement.current.focus();
    });
  }

  handleSearchButtonClick = (e) => {
    this.searchBar.current.classList.add('active');
    this.searchCardsInput.current.inputElement.current.focus();
  }

  handleOnSearchChange = (e) => {
    const { target } = e;

    this.setState(state => ({
      ...state,
      searchText: target.value,
    }));
  }

  render() {
    const {
      props,
      handleFocus,
      handleBlur,
      searchBar,
      searchCardsInput,
      navSearchInput,
      boardsBar,
      handleSearchButtonClick,
      handleOnSearchChange,
      clearInput,
    } = this;
    const { searchText } = this.state;
    const { nickname } = props.user;
    const emailInitials = `${nickname[0]}${nickname[1]}`.toUpperCase();

    return (
      <ul className="nav align-items-center justify-content-between">

        <li className="nav-item nav-button">
          <Link className="nav-link text-white nav-home-link p-0" to="/">
            <FontAwesomeIcon className="nav-link text-white p-0 home-icon" icon={faHome} />
          </Link>
        </li>

        <li className="nav-item dropdown nav-button">
          <button type="button" className="nav-link text-white">Boards</button>
        </li>

        <div className="logo-container text-center">
          <Link className="text-white text-decoration-none" to="/board/all">
            <FontAwesomeIcon icon={faThList} />
            <span className="font-weight-bold">Trello-like-app</span>
          </Link>
        </div>

        <li className="nav-item nav-button dropdown search-button">
          <div className="nav-search-input-container">
            <SearchInput
              ref={navSearchInput}
              inputValue={searchText}
              onChange={handleOnSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onCrossBtnClick={clearInput}
              hideSearchBtn
            />
            {/* <input ref={searchInput} onFocus={handleFocus} onBlur={handleBlur} onChange={handleOnSearchChange} type="text" className="nav-link text-white" placeholder="Search" value={searchText} />
            <FontAwesomeIcon onClick={clearInput} className="dropdown-search-icon clear-input-button" icon={faTimes} /> */}
          </div>
          <input onClick={handleSearchButtonClick} type="button" className="nav-link text-white" value="Search" />
        </li>

        <li className="nav-item nav-button user-logo">
          <Link className="nav-link rounded-circle bg-white text-center font-weight-bold" to="/board/all">{emailInitials || 'US'}</Link>
        </li>

        <div className="dropdown-menu dropdown-search" ref={searchBar}>
          <div className="container-fluid">

            <div className="row">
              <div className="col dropdown-search-container my-1">

                <SearchInput
                  ref={searchCardsInput}
                  onChange={handleOnSearchChange}
                  inputValue={searchText}
                  onCrossBtnClick={clearInput}
                  onBlur={handleBlur}
                />

              </div>
            </div>

            <div className="row search-results-container">
              <div className="col-12">
                <h5 className="mt-3 text-secondary text-center">Cards</h5>
              </div>
            </div>

          </div>
        </div>

      </ul>
    );
  }
}
// onFocus={handleFocus} onBlur={handleBlur}

const mapStateToProps = state => ({
  user: state.user.userData,
});

export default connect(mapStateToProps)(UserNavbar);
