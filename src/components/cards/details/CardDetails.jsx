import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import '../../../styles/cardDetails.sass';
import '../../../styles/popupContainer.sass';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import boardAction from '../../../actions/boardActions';
import Messages from '../../utils/Messages';
import CardDescription from './detailsComponents/CardDescription';
import CardTitle from './detailsComponents/CardTitle';
import CardLabels from './detailsComponents/CardLabels';
import CardComments from './detailsComponents/CardComments';
import useStatus from '../../../utlis/hooks/useStatus';


const CardDetails = (props) => {
  const {
    title,
    labels,
    comments,
    description,
    id,
    columnTitle,
    closeDetails,
    position,
    columnId,
    board,
    token,
    updateCard,
  } = props;

  const detailsContainer = useRef(null);

  const [moveCardPopupIsActive, setMoveCardPopupIsActive] = useState(false);
  const {
    status,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  } = useStatus();

  const handleUpdateRequest = (dataToUpdate) => {
    setStatusLoading();

    updateCard(token.token, board._id, id, dataToUpdate)
      .then(handleSuccess)
      .catch(handleError);
  };

  const setMoveCardPopupState = (e) => {
    e.preventDefault();
    setMoveCardPopupIsActive(prevState => !prevState);
  };

  const getPopupContainerPosition = (relativeElement, { paddingTop = 0, paddingLeft = 0 }) => {
    const left = `${relativeElement.offsetLeft + paddingLeft}px`;
    const top = `${relativeElement.offsetTop + paddingTop}px`;

    return {
      top,
      left,
    };
  };

  const blurOnShiftAndEnterPressed = (e) => {
    if (e.nativeEvent.shiftKey && (e.nativeEvent.charCode === 13 || e.nativeEvent.key === 'Enter')) {
      e.preventDefault();
      e.target.blur();
    }
  };

  const discardChangesOnEscapePressed = (setContent, content) => (e) => {
    const { target } = e;

    if (e.nativeEvent.key === 'Escape' || e.nativeEvent.keyCode === 27) {
      setContent(content);
      target.value = content;

      e.preventDefault();
      e.target.blur();
    }
  };

  const onBgClick = (e) => {
    if (e.target === detailsContainer.current) closeDetails(e);
  };

  return (
    <div
      ref={detailsContainer}
      className="w-100 h-100 card-details-wrap"
      tabIndex="0"
      role="button"
      onClick={onBgClick}
      onKeyPress={onBgClick}
    >

      {status.err.message && ReactDOM.createPortal(
        <Messages.ErrorMessage message={status.err.message} closeMessage={resetStatus} btn />,
        document.querySelector('.App'),
      )}

      <div className="card-details__container p-3">
        <FontAwesomeIcon onClick={closeDetails} className="popup-close-btn m-1" icon={faTimes} />

        <CardTitle
          title={title}
          position={position}
          columnTitle={columnTitle}
          columnId={columnId}
          handleUpdateRequest={handleUpdateRequest}
          discardChangesOnEscapePressed={discardChangesOnEscapePressed}
          blurOnShiftAndEnterPressed={blurOnShiftAndEnterPressed}
          setMoveCardPopupState={setMoveCardPopupState}
          moveCardPopupIsActive={moveCardPopupIsActive}
          getPopupContainerPosition={getPopupContainerPosition}
        />

        <CardLabels
          labels={labels}
          cardId={id}
          getPopupContainerPosition={getPopupContainerPosition}
        />

        <CardDescription
          description={description}
          handleUpdateRequest={handleUpdateRequest}
          discardChangesOnEscapePressed={discardChangesOnEscapePressed}
          blurOnShiftAndEnterPressed={blurOnShiftAndEnterPressed}
          handleSuccess={handleSuccess}
          handleError={handleError}
        />

        <CardComments
          cardId={id}
          comments={comments}
          blurOnShiftAndEnterPressed={blurOnShiftAndEnterPressed}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  updateCard: (token, boardId, id, dataToUpdate) => dispatch(boardAction.updateCard(token, boardId, id, dataToUpdate)),
});


CardDetails.propTypes = {

};


export default connect(mapStateToProps, mapDispatchToProps)(CardDetails);
