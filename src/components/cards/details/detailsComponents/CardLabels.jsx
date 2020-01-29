import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Label from './Label';


const CardLabels = (props) => {
  const { labels } = props;

  return (
    <div className="card-details__labels-wrap">
      <span className="font-weight-bold">LABELS</span>
      <div className="card-details__labels-container">

        <Label isTitleRevealed onClick={() => {}} title="label one" color="green" />
        <Label isTitleRevealed onClick={() => {}} title="label two" color="red" />
        <Label isTitleRevealed onClick={() => {}} title="label two" color="red" />
        <Label isTitleRevealed onClick={() => {}} title="label two" color="red" />
        <Label isTitleRevealed onClick={() => {}} title="label two" color="red" />
        <Label isTitleRevealed onClick={() => {}} title="label two" color="#f2d600" />
        <Label isTitleRevealed onClick={() => {}} title="label two" color="#f2d600" />
        <Label isTitleRevealed onClick={() => {}} title="label two" color="#f2d600" />
        <Label isTitleRevealed onClick={() => {}} title="label two" color="purple" />
        <Label isTitleRevealed onClick={() => {}} title="label two" color="purple" />
        <Label isTitleRevealed onClick={() => {}} title="label two" color="purple" />
        <Label isTitleRevealed onClick={() => {}} title="label two" color="skyblue" />

        <div tabIndex="0" role="button" onClick={() => { console.log('clicked') }} onKeyPress={() => { console.log('key pressed ') }} className="add-label-btn btn p-1 btn-sm">
          <FontAwesomeIcon icon={faPlus} />
        </div>

      </div>
    </div>
  );
};


CardLabels.propTypes = {

};


export default CardLabels;
