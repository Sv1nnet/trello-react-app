import React, { useState, useEffect, createContext } from 'react';
import { connect } from 'react-redux';
import boardActions from '../../actions/boardActions';
import Messages from '../utils/Messages';

export const ColumnListContext = createContext();

const ColumnListContextProvider = (props) => {
  const {
    children,
    token,
    board,
    updateColumnPositions,
  } = props;

  const [updatingState, setUpdatingState] = useState({
    message: '',
    statusCode: undefined,
  });

  const [columnsState, setColumnsState] = useState({
    sortedColumns: board.localColumns.length > 0
      // If there is localColumns (cashed)
      ? board.localColumns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      })
      : board.columns.sort((columnOne, columnTwo) => {
        if (columnOne.position < columnTwo.position) return -1;
        if (columnOne.position > columnTwo.position) return 1;
        return 0;
      }),
  });

  // Save changes in cashedColumns and then compare them with initial column positions in columnsState.sortedColumns
  // in updatePositions functions to find out whether we should update board and send request for updating
  const cashedColumns = columnsState.sortedColumns.map(column => ({
    _id: column._id,
    position: column.position,
  }));

  // Columns that we got from server and that didn't changed when COLUMN_SWITCHED action occured.
  // We compare them whith cashedColumns (they change when COLUMN_SWITCHED action occured) and
  // if at least one of them has changed position then we should send updatePositions request
  const initialColumns = board.columns.sort((columnOne, columnTwo) => {
    if (columnOne.position < columnTwo.position) return -1;
    if (columnOne.position > columnTwo.position) return 1;
    return 0;
  });

  const switchColumnPositions = (source, target) => {
    const sourcePosition = cashedColumns.find(column => column._id === source._id).position;
    const targetPosition = cashedColumns.find(column => column._id === target._id).position;

    cashedColumns.find(column => column._id === source._id).position = targetPosition;
    cashedColumns.find(column => column._id === target._id).position = sourcePosition;
    props.switchColumnPositions(cashedColumns);
  };

  // Send request to the server in order to update column positions
  const updatePositions = () => {
    // If cashedColumns has difference with initialColumns then send updateColumnPositions request
    const shouldUpdate = cashedColumns.some((column, i) => column._id !== initialColumns[i]._id);

    if (shouldUpdate) {
      updateColumnPositions(token.token, board._id, cashedColumns)
        .catch((err) => {
          setUpdatingState({ message: err.message, statusCode: err.status });
          setColumnsState({
            sortedColumns: board.columns.sort((columnOne, columnTwo) => {
              if (columnOne.position < columnTwo.position) return -1;
              if (columnOne.position > columnTwo.position) return 1;
              return 0;
            }),
          });
        });
    }
  };

  const closeMessage = () => {
    setUpdatingState({
      message: '',
      statusCode: undefined,
    });
  };

  // Re-sort columns after they changed(e.g. once they downloaded or their positions changed)
  useEffect(() => {
    setColumnsState({
      sortedColumns: board.localColumns.length > 0
        ? board.localColumns.sort((columnOne, columnTwo) => {
          if (columnOne.position < columnTwo.position) return -1;
          if (columnOne.position > columnTwo.position) return 1;
          return 0;
        })
        : board.columns.sort((columnOne, columnTwo) => {
          if (columnOne.position < columnTwo.position) return -1;
          if (columnOne.position > columnTwo.position) return 1;
          return 0;
        }),
    });
  }, [board]);

  return (
    <ColumnListContext.Provider value={{ columnsState, switchColumnPositions, updatePositions }}>
      {updatingState.message && <Messages.ErrorMessage message={updatingState.message} closeMessage={closeMessage} />}
      {children}
    </ColumnListContext.Provider>
  );
};

const mapStateToProps = state => ({
  token: state.user.token,
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  // Send request to the server to update column positions
  updateColumnPositions: (token, boardId, columns) => dispatch(boardActions.updateColumnPositions(token, boardId, columns)),
  // Switch column positions locally with no sending request until column stop being dragged (mouseUp event)
  switchColumnPositions: newColumns => dispatch(boardActions.switchColumnPositions(newColumns)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnListContextProvider);
