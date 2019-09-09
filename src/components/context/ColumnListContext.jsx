import React, { useState, useEffect, createContext } from 'react';
import { connect } from 'react-redux';
import boardActions from '../../actions/boardActions';

export const ColumnListContext = createContext();

const ColumnListContextProvider = (props) => {
  const {
    children,
    token,
    board,
    updateColumnPositions,
    handleError,
  } = props;

  const [columnsState, setColumnsState] = useState({
    sortedColumns: board.columns.sort((columnOne, columnTwo) => {
      if (columnOne.position < columnTwo.position) return -1;
      if (columnOne.position > columnTwo.position) return 1;
      return 0;
    }),
  });

  const cashedColumns = columnsState.sortedColumns.map(column => ({
    _id: column._id,
    position: column.position,
  }));

  const switchColumnPositions = (source, target) => {
    const sourcePosition = cashedColumns.find(column => column._id === source._id).position;
    const targetPosition = cashedColumns.find(column => column._id === target._id).position;

    cashedColumns.find(column => column._id === source._id).position = targetPosition;
    cashedColumns.find(column => column._id === target._id).position = sourcePosition;
  };

  const updatePositions = () => {
    const columnsToUpdate = cashedColumns.filter((column, i) => column.position !== columnsState.sortedColumns[i].position);

    return updateColumnPositions(token.token, board._id, columnsToUpdate)
      .then(res => console.log(res))
      .catch(err => handleError(err));
  };

  useEffect(() => {
    setColumnsState({
      sortedColumns: board.columns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      }),
    });
  }, [board.columns]);

  return (
    <ColumnListContext.Provider value={{ columnsState: { ...columnsState }, switchColumnPositions, updatePositions }}>
      {children}
    </ColumnListContext.Provider>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  updateColumnPositions: (token, boardId, columns) => dispatch(boardActions.updateColumnPositions(token, boardId, columns)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnListContextProvider);
