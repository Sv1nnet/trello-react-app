import React, { Component } from 'react';
import '../../styles/cardItem.sass';

class CardFace extends Component {
  render() {
    return (
      <div className="card-item d-flex px-2 pb-1 flex-wrap align-items-center">
        <div className="title">
          <span>Card title Card title Card title Card title Card title Card title Card title </span>
        </div>
      </div>
    );
  }
}

export default CardFace;
