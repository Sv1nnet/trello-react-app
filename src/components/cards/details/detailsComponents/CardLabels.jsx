import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Label from './Label';
import PopupContainer from '../../../utils/PopupContainer';
import AddLabelForm from './AddLabelForm';


const CardLabels = (props) => {
  const {
    labels,
    getPopupContainerPosition,
    cardId,
  } = props;
  const [addLabelPopupIsActive, setAddLabelPopupIsActive] = useState(false);
  const [popupPosition, setPopupPosition] = useState({});

  const buttonRef = useRef(null);
  const popupContainerRef = useRef(null);

  // Need this ref in order to find out should we close popup (if clicked the same element that opened the popup)
  // or open the popup/update popup position (if clicked an element different from that opened the popup).
  // So we will sign the element was clicked to this ref.
  const sourceOpenedPupopRef = useRef(null);

  const setAddLabelPopupState = (e, label) => {
    const el = label || buttonRef.current;
    const openedByLabelClick = !!label;

    if (openedByLabelClick) {
      if (label === sourceOpenedPupopRef.current) {
        sourceOpenedPupopRef.current = null;
        setAddLabelPopupIsActive(false);
        return;
      }

      if (!addLabelPopupIsActive) {
        sourceOpenedPupopRef.current = el;
        setAddLabelPopupIsActive(true);
        setPopupPosition(getPopupContainerPosition(el, { paddingTop: 35 }));
        return;
      }
    }

    if (addLabelPopupIsActive) {
      if (sourceOpenedPupopRef.current === buttonRef.current && !openedByLabelClick) {
        sourceOpenedPupopRef.current = null;
        setAddLabelPopupIsActive(false);
        return;
      }
    } else {
      setAddLabelPopupIsActive(true);
    }

    setPopupPosition(getPopupContainerPosition(el, { paddingTop: 35 }));
    sourceOpenedPupopRef.current = el;
  };

  useEffect(() => {
    const cardDetailsContainer = document.querySelector('.card-details__container');
    const isContainerOverflowed = cardDetailsContainer.offsetWidth !== cardDetailsContainer.scrollWidth;

    if (isContainerOverflowed) {
      popupContainerRef.current.style.left = '0';
    }
  }, [popupPosition]);

  const attachedLables = {};

  return (
    <div className="card-details__labels-wrap">
      <span className="font-weight-bold">LABELS</span>
      <div className="card-details__labels-container">

        {labels.map((label) => {
          attachedLables[label.id] = true;
          return (
            <Label isTitleRevealed events={{ onClick: setAddLabelPopupState }} key={label.id} id={label.id} title={label.title} color={label.color} />
          );
        })}

        <div tabIndex="0" role="button" ref={buttonRef} onClick={setAddLabelPopupState} onKeyPress={setAddLabelPopupState} className="add-label-btn btn p-1 btn-sm">
          <FontAwesomeIcon className="not-close-label-popup" icon={faPlus} />
        </div>

        {addLabelPopupIsActive && (
          <PopupContainer
            removeElement={() => { setAddLabelPopupIsActive(false); sourceOpenedPupopRef.current = null; }}
            closeBtn
            popupContainerRef={popupContainerRef}
            extraClasses={['card-details__popup']}
            classesToNotClosePopup={['label-container', 'label-content', 'add-label-btn', 'not-close-label-popup']}
            style={popupPosition}
          >
            <AddLabelForm cardId={cardId} attachedLabels={attachedLables} />
          </PopupContainer>
        )}

      </div>
    </div>
  );
};


CardLabels.propTypes = {

};


export default CardLabels;
