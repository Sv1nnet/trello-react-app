// React/Redux components
import React, { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

// Custom components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Label from './Label';
import AddLabelForm from './AddLabelForm';

// Utils
import PopupContainer from '../../../utils/PopupContainer';
import isOutOfViewport from '../../../../utlis/isOutOfViewport';


const propTypes = {
  labels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    color: PropTypes.string.isRequired,
  })),
  getPopupContainerPosition: PropTypes.func.isRequired,
  cardId: PropTypes.string.isRequired,
};

const defaultProps = {
  labels: [],
};


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
  // or open popup or update popup position (if user clicks an element different from one that opened the popup).
  // So we will sign the element that was clicked to this ref.
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

  // If popup doesn't fit the screen then make it to fit
  useLayoutEffect(() => {
    const isOutResult = popupContainerRef.current ? isOutOfViewport(popupContainerRef.current) : {};

    if (isOutResult.right) {
      const windowWidth = window.innerWidth;
      const popupBoundingRect = popupContainerRef.current.getBoundingClientRect();
      const popupLeft = parseInt(popupContainerRef.current.style.left, 10);
      const updatedLeft = popupLeft - (popupBoundingRect.right - windowWidth);

      popupContainerRef.current.style.left = `${updatedLeft}px`;
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


CardLabels.propTypes = propTypes;
CardLabels.defaultProps = defaultProps;


export default CardLabels;
