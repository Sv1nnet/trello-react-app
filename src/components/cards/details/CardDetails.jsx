import React, { useState, useRef } from 'react';
import '../../../styles/cardDetails.sass';
import '../../../styles/popupContainer.sass';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../../utils/TextInput';
import PopupContainer from '../../utils/PopupContainer';
import boardAction from '../../../actions/boardActions';
import Messages from '../../utils/Messages';
import isEnterPressed from '../../../utlis/isEnterPressed';
import Label from '../../labels/Label';
import CardDescription from './detailsComponents/CardDescription';
import CardTitle from './detailsComponents/CardTitle';
import CardLabels from './detailsComponents/CardLabels';


const CardDetails = (props) => {
  const {
    title,
    labels,
    comments,
    description,
    id,
    columnTitle,
    closeDetails,
    board,
    token,
    updateCard,
  } = props;

  const detailsContainer = useRef(null);

  const [moveCardPopupIsActive, setMoveCardPopupIsActive] = useState(false);
  const [status, setStatus] = useState({
    loading: false,
    err: {
      statusCode: null,
      message: null,
    },
    success: {
      statusCode: null,
      message: null,
      data: null,
    },
  });

  const handleUpdateRequest = (dataToUpdate) => {
    setStatus(prevStatus => ({
      ...prevStatus,
      loading: true,
    }));

    updateCard(token.token, board._id, id, dataToUpdate)
      .then((res) => {
        setStatus({
          loading: false,
          err: {
            statusCode: null,
            message: null,
          },
          success: {
            statusCode: res.status,
            message: res.data.message,
            data: res.data,
          },
        });
      })
      .catch((err) => {
        setStatus({
          loading: false,
          err: {
            statusCode: err.status,
            message: err.message,
          },
          success: {
            statusCode: null,
            message: null,
            data: null,
          },
        });
      });
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

  const closeMessage = () => {
    setStatus({
      loading: false,
      err: {
        statusCode: null,
        message: null,
      },
      success: {
        statusCode: null,
        message: null,
        data: null,
      },
    });
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

      {status.err.message && <Messages.ErrorMessage closeMessage={closeMessage} message={status.err.message} />}

      <div className="card-details-container p-3">
        <FontAwesomeIcon onClick={closeDetails} className="popup-close-btn m-1" icon={faTimes} />

        <CardTitle
          title={title}
          columnTitle={columnTitle}
          handleUpdateRequest={handleUpdateRequest}
          discardChangesOnEscapePressed={discardChangesOnEscapePressed}
          blurOnShiftAndEnterPressed={blurOnShiftAndEnterPressed}
          setMoveCardPopupState={setMoveCardPopupState}
          moveCardPopupIsActive={moveCardPopupIsActive}
          getPopupContainerPosition={getPopupContainerPosition}
        />

        <CardLabels
          labels={labels}
        />

        <CardDescription
          description={description}
          handleUpdateRequest={handleUpdateRequest}
          discardChangesOnEscapePressed={discardChangesOnEscapePressed}
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
