/* eslint-disable react/destructuring-assignment */
// React/Redux components
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Custom components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThList, faHome } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../utils/TextInput';
import PopupContainer from '../utils/PopupContainer';
import BoardListItem from '../boards/BoardListItem';
import CreateBoard from '../boards/CreateBoard';
import CardsSearchDropdown from '../lists/CardsSearchDropdown';

// mapState and actions
import { mapStateToProps } from '../../utlis/reduxMapFunction';
import authActions from '../../actions/authActions';
import boardActions from '../../actions/boardActions';

// Styles
import '../../styles/navbar.sass';


const propTypes = {
  userData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    boards: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  token: PropTypes.shape({
    access: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
  logout: PropTypes.func.isRequired,
  loadAllBoards: PropTypes.func.isRequired,
};


class UserNavbar extends Component {
  constructor(props) {
    super(props);

    this.searchBtn = React.createRef();
    this.searchBar = React.createRef();
    this.navSearchInput = React.createRef();
    this.searchCardsInput = React.createRef();
  }

  state = {
    searchText: '',
    userPopupActive: false,
    boardsPopupActive: false,
    createBoardActive: false,
  }

  // Handle focus event for search input
  onSearchInputFocus = (e) => {
    e.target.classList.add('active'); // Set search input active state
    this.searchBar.current.classList.add('active'); // Show search popup window
  }

  // Handle blur event for search input
  onSearchInputBlur = (e) => {
    const activeInputElement = this.navSearchInput.current.inputElement.current;

    if (getComputedStyle(activeInputElement).display !== 'none') {
      if (!e.target.value) {
        e.target.classList.remove('active');
        this.searchBar.current.classList.remove('active');
      }
    } else if (!e.target.value && e.target === this.searchBtn.current) {
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
  onSearchButtonClick = () => {
    const isSearchBarActive = this.searchBar.current.classList.contains('active');

    if (isSearchBarActive) {
      this.setState(state => ({
        ...state,
        searchText: '',
      }),
      () => {
        this.searchBar.current.classList.remove('active');
      });
    } else {
      this.searchBar.current.classList.add('active');
      this.searchCardsInput.current.inputElement.current.focus();
    }
  }

  // Just set new state when value in search input changes
  onSearchChange = (e) => {
    const { target } = e;

    this.setState(state => ({
      ...state,
      searchText: target.value,
    }));
  }

  // Show or hide user popup component. Also, we pass it to removeElement prop of userPopup
  onPopupBtnClick = (e, popupToClose) => {
    const popupType = popupToClose || e.target.dataset.popupType;
    const { props } = this;

    // If we open all boards popup then we need download all board from the server
    if (popupType === 'boardsPopupActive') {
      this.setState(state => ({
        ...state,
        [popupType]: !state[popupType],
      }),
      () => { // Load all boards if popup opened
        if (this.state[popupType]) {
          props.loadAllBoards(props.token.token);
        }
      });
    } else {
      this.setState(state => ({
        ...state,
        [popupType]: !state[popupType],
      }));
    }
  }

  openCreateBoard = (e) => {
    e.preventDefault();

    this.setState(state => ({
      ...state,
      createBoardActive: true,
    }));
  }

  closeCreateBoard = () => {
    this.setState(state => ({
      ...state,
      createBoardActive: false,
    }));
  }

  logout = (e) => {
    e.preventDefault();

    const { logout, token } = this.props;

    logout(token.token);

    window.localStorage.setItem('user', '');
    window.location.reload();
  }

  render() {
    const {
      props,
      state,
      onSearchInputFocus,
      onSearchInputBlur,
      searchBar,
      searchBtn,
      searchCardsInput,
      navSearchInput,
      onSearchButtonClick,
      onSearchChange,
      clearInput,
      onPopupBtnClick,
      closeCreateBoard,
      openCreateBoard,
    } = this;

    const {
      searchText,
      userPopupActive,
      boardsPopupActive,
      createBoardActive,
    } = state;

    const { board, userData } = props;
    const { nickname, email, boards } = userData;
    const emailInitials = nickname && `${nickname[0]}${nickname[1]}`.toUpperCase();

    const [, route, endPoint] = window.location.pathname.split('/');
    const isBoardOpened = (route !== 'user') && (route === 'board' && endPoint !== 'all');

    return (
      <>
        <ul className="nav align-items-center justify-content-between">

          <li className="nav-item nav-button">
            <Link className="nav-link text-white nav-home-link p-0" to="/">
              <FontAwesomeIcon className="nav-link text-white p-0 home-icon" icon={faHome} />
            </Link>
          </li>

          <li className="nav-item dropdown nav-button">
            <button onClick={onPopupBtnClick} data-popup-type="boardsPopupActive" type="button" className="nav-link text-white">Boards</button>
          </li>

          <div className="logo-container text-center">
            <Link className="text-white text-decoration-none" to="/board/all">
              <FontAwesomeIcon icon={faThList} />
              <span className="font-weight-bold">Trello-like</span>
            </Link>
          </div>

          {
            isBoardOpened && (
              <li className="nav-item nav-button dropdown search-button">
                <div className="nav-search-input-container">

                  <TextInput
                    ref={navSearchInput}
                    containerClassList="nav-search-input__text-input"
                    inputValue={searchText}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onFocus={onSearchInputFocus}
                    onBlur={onSearchInputBlur}
                    onCrossBtnClick={clearInput}
                    hideSearchBtn
                  />

                </div>
                <input ref={searchBtn} onClick={onSearchButtonClick} type="button" className="nav-link text-white" value="Search" />
              </li>
            )}
          <li className="nav-item nav-button user-logo">
            <button onClick={onPopupBtnClick} data-popup-type="userPopupActive" type="button" className="nav-link p-0 w-100 text-primary rounded-circle bg-white text-center font-weight-bold">{emailInitials || 'US'}</button>
          </li>

          {/* Further I placed dropdown menu for navigation. Search specifically in dropdown-menu container and User menu, Boards list as separeted components out of dropdown-menu container */}
          {
            isBoardOpened && (
              <CardsSearchDropdown
                searchBar={searchBar}
                searchCardsInput={searchCardsInput}
                onSearchChange={onSearchChange}
                searchText={searchText}
                clearInput={clearInput}
                onSearchInputBlur={onSearchInputBlur}
                cards={board.cards}
              />
            )
          }

          {
            boardsPopupActive
            && (
              <PopupContainer popupToClose="boardsPopupActive" classesToNotClosePopup={['dropdown-boards', 'boards-title', 'message-container', 'message', 'btn']} extraClasses={['dropdown-boards']} removeElement={onPopupBtnClick} userData={{ email, nickname }}>
                <h5 className="mt-2 w-100 boards-title text-secondary text-center">Boards</h5>

                <div className="board-list-container">
                  {boards.map(board => <BoardListItem key={board._id} id={board._id} owner={board.owner} title={board.title} events={{ onClick: e => onPopupBtnClick(e, 'boardsPopupActive') }} />)}
                </div>

                <div className="col-12 px-0 text-center dropdown-board-list-item pt-2">
                  <a onClick={openCreateBoard} href="/">Create a new board</a>
                </div>
              </PopupContainer>
            )
          }

          {
            userPopupActive
            && (
              <PopupContainer popupToClose="userPopupActive" classesToNotClosePopup={['user-credentials']} targetClasses={['dropdown-user', 'user-credentials']} extraClasses={['dropdown-user']} removeElement={onPopupBtnClick} userData={{ email, nickname }}>
                <div className="col-12 dropdown-user-credentials pt-2 border-bottom">
                  <p className="user-credentials text-center">{`${email} (${nickname})`}</p>
                </div>

                <div className="col-12 px-0 dropdown-user-credentials pt-2 pb-2 border-bottom">
                  <Link className="text-center w-100 d-block" to="/user">Edit account</Link>
                </div>

                <div className="col-12 px-0 dropdown-user-credentials pt-2">
                  <Link onClick={this.logout} className="text-center w-100 d-block" to="/logout">Log out</Link>
                </div>
              </PopupContainer>
            )
          }
        </ul>

        {createBoardActive && <CreateBoard close={closeCreateBoard} />}
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: token => dispatch(authActions.logout(token)),
  loadAllBoards: token => dispatch(boardActions.loadAllBoards(token)),
});


UserNavbar.propTypes = propTypes;


export default connect(mapStateToProps.mapFullUserData, mapDispatchToProps)(UserNavbar);
