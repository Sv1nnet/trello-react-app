import React, { Component } from 'react';
import '../../styles/cardItem.sass';

const CardFace = ({ cardTitle }) => {
  return (
    <div className="card-item d-flex px-2 flex-wrap align-items-center">
      <div className="title">
        <span>{cardTitle}</span>
      </div>
    </div>
  );
}

export default CardFace;
