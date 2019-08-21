import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import '../../styles/boardListItem.sass';


const propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};


const BoardListItem = (props) => {
  const { id, title } = props;
  const url = `/board/${id}`;
  return (
    <div className="col-12 px-0 dropdown-board-list-item pt-2">
      <div className="board-list-item-container">
        <Link to={url} className="px-1 w-100 d-block text-decoration-none text-center font-weight-bold">{title}</Link>
      </div>
    </div>
  );
};


BoardListItem.propTypes = propTypes;


export default BoardListItem;
