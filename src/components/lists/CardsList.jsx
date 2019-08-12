import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../styles/cardsList.sass';
import CardFace from '../cards/CardFace';

class CardsList extends Component {
  render() {
    return (
      <div className="cards-list-container">
        <h5 className="d-block w-100">List title</h5>
        <div className="cards-container">
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
          <CardFace />
        </div>
        <div className="create-card-button-wrapper my-1 mx-1">
          <a href="/" className="btn btn-sm btn-block">
            <FontAwesomeIcon className="add-icon" icon={faPlus} />
            <span>Add another card</span>
          </a>
        </div>
      </div>
    );
  }
}

export default CardsList;
