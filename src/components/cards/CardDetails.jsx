import React, { useState } from 'react';
import '../../styles/cardDetails.sass';
import '../../styles/popupContainer.sass';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import TextInput from '../utils/TextInput';
import PopupContainer from '../utils/PopupContainer';
import boardAction from '../../actions/boardActions';
import Messages from '../utils/Messages';
import isEnterPressed from '../../utlis/isEnterPressed';


const CardDetails = (props) => {
  const {
    title,
    marks,
    comments,
    description,
    cardId,
    columnTitle,
    closeDetails,
    board,
    token,
    updateCard,
  } = props;

  const [moveCardPopupIsActive, setMoveCardPopupIsActive] = useState(false);
  const [cardTitle, setCardTitle] = useState(title);
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

  const setMoveCardPopupState = (e) => {
    e.preventDefault();
    setMoveCardPopupIsActive(prevState => !prevState);
  };

  const getPopupContainerPosition = (relativeElement) => {
    const left = `${relativeElement.offsetLeft}px`;
    const top = `${relativeElement.offsetTop + 17}px`;

    return {
      top,
      left,
    };
  };

  const onKeyPress = (e) => {
    if (e.nativeEvent.shiftKey && (e.nativeEvent.charCode === 13 || e.nativeEvent.key === 'Enter')) {
      e.preventDefault();
      e.target.blur();
    }
  };

  const onBlur = (e) => {
    if (title === cardTitle) return;

    const dataToUpdate = {
      title: cardTitle,
    };

    setStatus(prevStatus => ({
      loading: true,
      ...prevStatus,
    }));

    updateCard(token.token, board._id, cardId, dataToUpdate)
      .then((res) => {
        setStatus({
          loading: false,
          err: {
            statusCode: null,
            message: null,
          },
          success: {
            statusCode: 200,
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

  const onChange = (e) => {
    const { target } = e;

    // Prevent from adding new line in card title
    if (isEnterPressed(e)) {
      e.preventDefault();
      return;
    }

    setCardTitle(target.value);
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

  return (
    <>
      <div className="card-details-bg" role="button" tabIndex="0" onKeyPress={closeDetails} onClick={closeDetails} />

      {status.err.message && <Messages.ErrorMessage closeMessage={closeMessage} message={status.err.message} />}

      <div className="card-details-container p-3">
        <FontAwesomeIcon onClick={closeDetails} className="popup-close-btn m-1" icon={faTimes} />
        <div className="card-title-container w-100">
          <TextInput
            hideSearchBtn
            hideCrossBtn
            inputType="textarea"
            maxLength="128"
            inputValue={cardTitle}
            onChange={onChange}
            onKeyPress={onKeyPress}
            onBlur={onBlur}
            classList="card-details-title-input"
          />
          <div className="column-title">
            in list {(
              <a href="/" onClick={setMoveCardPopupState}>
                {columnTitle}
              </a>
            )}

            {moveCardPopupIsActive && (
              <PopupContainer
                removeElement={setMoveCardPopupState}
                closeBtn
                extraClasses={['card-details-move-card-popup']}
                style={getPopupContainerPosition(document.querySelector('.column-title > a'))}
              >
                <span className="popup-title">Move Card</span>
              </PopupContainer>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  updateCard: (token, boardId, cardId, dataToUpdate) => dispatch(boardAction.updateCard(token, boardId, cardId, dataToUpdate)),
});


CardDetails.propTypes = {

};


export default connect(mapStateToProps, mapDispatchToProps)(CardDetails);
