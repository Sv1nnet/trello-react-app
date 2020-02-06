import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Label from './Label';
import PopupContainer from '../../../utils/PopupContainer';
import AddLabelForm from './AddLabelForm';
import hasParent from '../../../../utlis/hasParent';



const CardLabels = (props) => {
  const {
    labels,
    getPopupContainerPosition,
    cardId,
  } = props;
  const [addLabelPopupIsActive, setAddLabelPopupIsActive] = useState(false);
  const [popupPosition, setPopupPosition] = useState({});
  const buttonRef = useRef(null);

  const setAddLabelPopupState = (e, label) => {
    const el = label || buttonRef.current;

    setAddLabelPopupIsActive(prevState => !prevState);
    setPopupPosition(getPopupContainerPosition(el, { paddingTop: 35 }));
  };

  const attachedLables = {};

  return (
    <div className="card-details__labels-wrap">
      <span className="font-weight-bold">LABELS</span>
      <div className="card-details__labels-container">

        {labels.map((label) => {
          attachedLables[label.id] = true;
          return (
            <Label isTitleRevealed onClick={setAddLabelPopupState} key={label.id} title={label.title} color={label.color} />
          );
        })}

        <div tabIndex="0" role="button" ref={buttonRef} onClick={setAddLabelPopupState} onKeyPress={() => { console.log('key pressed ') }} className="add-label-btn btn p-1 btn-sm">
          <FontAwesomeIcon icon={faPlus} />
        </div>

        {addLabelPopupIsActive && (
          <PopupContainer
            removeElement={setAddLabelPopupState}
            closeBtn
            extraClasses={['card-details__popup']}
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
