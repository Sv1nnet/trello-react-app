/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../styles/board.sass';
import Loader from '../utils/Loader';
import PopupContainer from '../utils/PopupContainer';
import CardsList from '../lists/CardsList';
import RenameBoardForm from '../forms/RenameBoardForm';
import ReadonlyAccessBoardForm from '../forms/ReadonlyAccessBoardForm';
import PublicAccessBoardForm from '../forms/PublicAccessBoardForm';
import MembersForm from '../forms/MembersForm';

class Board extends Component {
  state = {
    status: {
      loading: false,
      success: { // for success resquests
        message: '',
        statusCode: undefined,
      },
      err: { // for resquests errors
        message: '',
        statusCode: undefined,
      },
    },
    popup: {
      isRenamePopupActive: false,
      isReadonlyPopupActive: false,
      isPrivatePopupActive: false,
      isMembersPopupActive: false,
      isMenuPopupActive: false,
    },
  }

  componentDidMount() {

  }

  handlePopupBtnClick = (e, popupToClose) => {
    const popupType = popupToClose || e.target.dataset.popupType;

    this.setState((state) => {
      const newState = {
        ...state,
      };

      for (const field in state.popup) {
        newState.popup[field] = false;
      }

      newState.popup[popupType] = !state.popup[popupType];

      return newState;
    });
  }

  render() {
    const { props, state, handlePopupBtnClick } = this;
    const { board } = props;
    const {
      title,
      isReadOnly,
      isPrivate,
      members,
    } = board;

    if (state.status.loading) return <Loader.PageLoader bg />;

    return (
      <div className="board-container position-relative">
        <div className="board-controls-container d-flex flex-wrap align-items-center">

          <div className="board-control-item board-control-item-title">
            <button onClick={handlePopupBtnClick} data-popup-type="isRenamePopupActive" type="button" className={`board-control-button bg-transparent text-white border-0 nav-button board-title ${state.popup.isRenamePopupActive ? 'active' : ''}`}>{title}</button>
          </div>

          <div className="d-flex flex-wrap align-items-center board-control-item board-control-item-title board-control-access-item">
            <span className="board-control-item-divider" />
            <button onClick={handlePopupBtnClick} data-popup-type="isReadonlyPopupActive" type="button" className={`board-control-button bg-transparent text-white border-0 nav-button board-access ${state.popup.isReadonlyPopupActive ? 'active' : ''}`}>{isReadOnly ? 'Read-only' : 'Editable'}</button>
            <span className="board-control-item-divider" />
            <button onClick={handlePopupBtnClick} data-popup-type="isPrivatePopupActive" type="button" className={`board-control-button bg-transparent text-white border-0 nav-button board-access  ${state.popup.isPrivatePopupActive ? 'active' : ''}`}>{isPrivate ? 'Private' : 'Public'}</button>
            <span className="board-control-item-divider" />
          </div>

          <div className="d-flex flex-wrap align-items-center board-control-item board-control-item-title">
            <button onClick={handlePopupBtnClick} data-popup-type="isMembersPopupActive" type="button" className={`board-control-button bg-transparent text-white border-0 nav-button board-access ${state.popup.isMembersPopupActive ? 'active' : ''}`}>Members</button>
          </div>

          <div className="d-flex flex-wrap align-items-center ml-auto board-control-item board-control-item-title">
            <button onClick={handlePopupBtnClick} data-popup-type="isMenuPopupActive" type="button" className={`board-control-button bg-transparent text-white border-0 nav-button board-access ${state.popup.isMenuPopupActive ? 'active' : ''}`}>Menu</button>
          </div>


          {state.popup.isRenamePopupActive && (
            <PopupContainer removeElement={handlePopupBtnClick} targetClasses={['rename-board-input', 'board-control-popup-btn', 'clear-input-button']} closeBtn extraClasses={['board-controls-dropdown']}>
              <RenameBoardForm boardTitle={title} />
            </PopupContainer>
          )}

          {state.popup.isReadonlyPopupActive && (
            <PopupContainer removeElement={handlePopupBtnClick} closeBtn targetClasses={['access-label', 'access-input', 'board-control-popup-btn']} extraClasses={['board-controls-dropdown', 'board-controls-dropdown-readonly']}>
              <ReadonlyAccessBoardForm isReadOnly={isReadOnly} />
            </PopupContainer>
          )}

          {state.popup.isPrivatePopupActive && (
            <PopupContainer removeElement={handlePopupBtnClick} closeBtn targetClasses={['access-label', 'access-input', 'board-control-popup-btn']} extraClasses={['board-controls-dropdown', 'board-controls-dropdown-private']}>
              <PublicAccessBoardForm isPrivate={isPrivate} />
            </PopupContainer>
          )}

          {state.popup.isMembersPopupActive && (
            <PopupContainer removeElement={handlePopupBtnClick} closeBtn targetClasses={['members-board-input']} extraClasses={['board-controls-dropdown', 'board-controls-dropdown-members']}>
              <MembersForm members={members} />
            </PopupContainer>
          )}

          {/* {state.isMenuPopupActive && (
            <PopupContainer removeElement={handlePopupBtnClick} closeBtn targetClasses={['members-board-input']} extraClasses={['board-controls-dropdown', 'board-controls-dropdown-members']}>
              <MembersForm members={members} />
            </PopupContainer>
          )} */}
        </div>

        <div className="board-lists-container d-flex align-items-start">
          <CardsList />
          <CardsList />

          <div className="add-new-column-button-container">
            <a href="/" className="btn btn-sm btn-block">
              <span>
                <FontAwesomeIcon className="add-icon" icon={faPlus} /> Add another list
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  board: state.board,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps)(Board);
