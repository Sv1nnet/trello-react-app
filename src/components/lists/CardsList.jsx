/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../styles/cardsList.sass';
import CardFace from '../cards/CardFace';

// class CardsList extends Component {
//   render() {

//   }
// }

const CardsList = ({ cards, listTitle }) => {
  const sortedCards = cards.sort((cardOne, cardTwo) => {
    if (cardOne.position < cardTwo.position) return -1;
    if (cardOne.position > cardTwo.position) return 1;
    return 0;
  });

  return (
    <div className="cards-list-container">
      <h5 className="d-block w-100">{listTitle}</h5>
      <div className="cards-container">
        {sortedCards.map(card => <CardFace key={card._id} cardTitle={card.title} />)}
      </div>
      <div className="create-card-button-wrapper my-1 mx-1">
        <a href="/" className="btn btn-sm btn-block">
          <FontAwesomeIcon className="add-icon" icon={faPlus} />
          <span>Add another card</span>
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CardsList);
