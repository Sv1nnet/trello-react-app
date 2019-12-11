import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import DragDropContext from './DragDropContext';


const propTypes = {
  children: PropTypes.func.isRequired,
};


const Droppable = ({ children }) => {
  const {
    dragState,
    onDragStart,
    onDragUpdate,
    onDragEnd,
  } = useContext(DragDropContext);
  const provider = {};



  return children(provider, dragState);
};


Droppable.propTypes = propTypes;


export default Droppable;
