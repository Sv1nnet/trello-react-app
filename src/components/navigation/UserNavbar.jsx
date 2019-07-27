/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThList, faHome } from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../utils/SearchInput';
import '../../styles/navbar.sass';
import PopupContainer from '../utils/PopupContainer';

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
    userPopupActive: false,
    boardsPopupActive: false,
  }

  // Handle focus event for search input
  handleFocus = (e) => {
    e.target.classList.add('active'); // Set search input active state
    this.searchBar.current.classList.add('active'); // Show search popup window
  }

  // Handle blur event for search input
  handleBlur = (e) => {
    if (!e.target.value) {
      e.target.classList.remove('active');
      this.searchBar.current.classList.remove('active');
    }
  }

  // Clear search input value. We call it when cross button pressed
  clearInput = () => {
    const { navSearchInput, searchCardsInput } = this;
    this.setState(state => ({
      ...state,
      searchText: '',
    }),
      () => {
        // After we clear search input we need return focus to it
        if (getComputedStyle(navSearchInput.current.inputElement.current).display !== 'none') navSearchInput.current.inputElement.current.focus();
        if (getComputedStyle(searchCardsInput.current.inputElement.current).display !== 'none') searchCardsInput.current.inputElement.current.focus();
      });
  }

  // This works on small screen. Search button showed instead of search text input so when we click the button search popup appears
  handleSearchButtonClick = (e) => {
    this.searchBar.current.classList.add('active');
    this.searchCardsInput.current.inputElement.current.focus();
  }

  // Just set new state when value in search input changes
  handleOnSearchChange = (e) => {
    const { target } = e;

    this.setState(state => ({
      ...state,
      searchText: target.value,
    }));
  }

  // Show or hide user popup component. Also, we pass it to removeElement prop of userPopup
  handlePopupBtnClick = (popup) => {
    this.setState(state => ({
      ...state,
      [popup]: !state[popup],
    }));
  }

  render() {
    const {
      props,
      state,
      handleFocus,
      handleBlur,
      searchBar,
      searchCardsInput,
      navSearchInput,
      boardsBar,
      handleSearchButtonClick,
      handleOnSearchChange,
      clearInput,
      handlePopupBtnClick,
    } = this;
    const { searchText, userPopupActive, boardsPopupActive } = state;
    const { nickname, email } = props.user;
    const emailInitials = `${nickname[0]}${nickname[1]}`.toUpperCase();

    return (
      <>
        <ul className="nav align-items-center justify-content-between">

          <li className="nav-item nav-button">
            <Link className="nav-link text-white nav-home-link p-0" to="/">
              <FontAwesomeIcon className="nav-link text-white p-0 home-icon" icon={faHome} />
            </Link>
          </li>

          <li className="nav-item dropdown nav-button">
            <button onClick={() => handlePopupBtnClick('boardsPopupActive')} type="button" className="nav-link text-white">Boards</button>
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

            </div>
            <input onClick={handleSearchButtonClick} type="button" className="nav-link text-white" value="Search" />
          </li>

          <li className="nav-item nav-button user-logo">
            <button onClick={() => handlePopupBtnClick('userPopupActive')} type="button" className="nav-link p-0 w-100 text-primary rounded-circle bg-white text-center font-weight-bold">{emailInitials || 'US'}</button>
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

          {
            boardsPopupActive
            && (
              <PopupContainer popupToClose="boardsPopupActive" targetClasses={['dropdown-boards', 'boards-title']} extraClasses={['dropdown-boards']} removeElement={handlePopupBtnClick} userData={{ email, nickname }}>
                <h5 className="mt-3 w-100 boards-title text-secondary text-center">Boards</h5>

                <div className="col-12 px-0 dropdown-user-credentials pt-2">
                  
                </div>
              </PopupContainer>
            )
          }

          {
            userPopupActive
            && (
              <PopupContainer popupToClose="userPopupActive" targetClasses={['dropdown-user', 'user-credentials']} extraClasses={['dropdown-user']} removeElement={handlePopupBtnClick} userData={{ email, nickname }}>
                <div className="col-12 dropdown-user-credentials pt-2 border-bottom">
                  <p className="user-credentials text-center">{`${email} (${nickname})`}</p>
                </div>

                <div className="col-12 px-0 dropdown-user-credentials pt-2 pb-2 border-bottom">
                  <Link className="text-center w-100 d-block" to="/user">Edit account</Link>
                </div>

                <div className="col-12 px-0 dropdown-user-credentials pt-2">
                  <Link className="text-center w-100 d-block" to="/logout">Log out</Link>
                </div>
              </PopupContainer>
            )
          }
          {/* {userPopupActive && <UserPopupMenu removeElement={handlePopupBtnClick} userData={{ email, nickname }} />} */}
        </ul>
      </>
    );
  }
}
// onFocus={handleFocus} onBlur={handleBlur}

const mapStateToProps = state => ({
  user: state.user.userData,
});

export default connect(mapStateToProps)(UserNavbar);
