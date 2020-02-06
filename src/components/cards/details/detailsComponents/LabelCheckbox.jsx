import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import boardActions from '../../../../actions/boardActions';

const LabelCheckbox = ({ id, color, colorName, title, checked, onChange, updateLabel }) => {
  
  return (
    <div className="color-label-checkbox__container">
      <label htmlFor={id} style={{ backgroundColor: color }} className="color-checkbox-label">{title}</label>
      <input type="checkbox" onChange={onChange} checked={checked} name={colorName} id={id} className="color-checkbox" />
      <FontAwesomeIcon icon={faCheck} className="check-icon" />
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  updateLabel: (token, boardId, cardId, data) => dispatch(boardActions.updateLabel(token, boardId, cardId, data)),
});


LabelCheckbox.propTypes = {

};


export default connect(mapStateToProps, mapDispatchToProps)(LabelCheckbox);
