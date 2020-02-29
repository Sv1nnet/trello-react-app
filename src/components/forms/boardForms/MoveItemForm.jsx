import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../../styles/moveCardForm.sass';
import isOutOfViewport from '../../../utlis/isOutOfViewport';


const propTypes = {
  popupContainerRef: PropTypes.shape({
    current: PropTypes.instanceOf(HTMLElement),
  }).isRequired,
};


const MoveItemForm = (props) => {
  const {
    title,
    labels,
    deleteBtn,
    onSubmit,
    popupContainerRef,
  } = props;

  // If popup doesn't fit the screen then make it to fit
  useEffect(() => {
    const isOutResult = popupContainerRef.current ? isOutOfViewport(popupContainerRef.current) : {};

    if (isOutResult.right) {
      const windowWidth = window.innerWidth;
      const popupBoundingRect = popupContainerRef.current.getBoundingClientRect();
      const popupLeft = parseInt(popupContainerRef.current.style.left, 10);
      const updatedLeft = popupLeft - (popupBoundingRect.right - windowWidth);

      popupContainerRef.current.style.left = `${updatedLeft}px`;
    }
  }, [popupContainerRef]);

  return (
    <div className="move-item-popup__container">
      <span className="popup-title">{title}</span>
      <form action="" onSubmit={onSubmit}>
        <span className="destination-popup-title">SELECT DESTINATION</span>

        <div className="move-item-form__labels-container">
          {
            labels.map(label => (
              <label key={label.key} className={`label-container__label label-container__label_${label.modificator}`} htmlFor={label.select.props.id}>{label.title}
                <br />
                <select {...label.select.props}>
                  {label.select.options.map(option => (
                    option && <option {...option.props}>{option.title}</option>
                  ))}
                </select>
              </label>
            ))
          }
        </div>

        <button className="move-item-popup__submit-btn btn btn-primary" type="submit">Move</button>
        {
          deleteBtn && (
            <button className="move-item-popup__delete-item-btn btn btn-danger" type="button" onClick={deleteBtn.onClick}>{deleteBtn.title}</button>
          )
        }
      </form>
    </div>
  );
};


MoveItemForm.propTypes = propTypes;


export default MoveItemForm;
