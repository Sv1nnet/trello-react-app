/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Droppable from '../utils/dragdrop/Droppable';
import DragDropContextProvider from '../utils/dragdrop/DragDropContext';
import boardActions from '../../actions/boardActions';
import Messages from '../utils/Messages';
import ColumnContainer from '../columns/ColumnContainer';
import '../../styles/columnList.sass';
import AddBoardContent from '../utils/AddBoardContent';


const propTypes = {
  token: PropTypes.shape({
    access: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    members: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    cards: PropTypes.array.isRequired,
  }).isRequired,
  createColumn: PropTypes.func.isRequired,
};


const ColumnList = (props) => {
  const { createColumn, token, board } = props;


  const [updatePositionsState, setUpdatePositionsState] = useState({
    err: {
      message: '',
      statusCode: undefined,
    },
  });

  const boardListContainerRef = useRef(null);

  const handleError = (err) => {
    setUpdatePositionsState({
      ...updatePositionsState,
      err: {
        message: err.message,
        statusCode: err.status,
      },
    });
  };

  const addColumn = (e, columnTitle) => {
    e.preventDefault();

    if (!columnTitle) {
      const err = { status: 400, message: 'Column title can not be blank' };
      handleError(err);
      return Promise.reject(err);
    }

    const column = {
      title: columnTitle,
      position: board.columns.length,
    };

    if (column.title) {
      return createColumn(token.token, board._id, column)
        .catch((err) => {
          handleError(err);
          return Promise.reject(err);
        });
    }
  };

  const closeMessage = () => {
    setUpdatePositionsState({
      ...updatePositionsState,
      err: {
        message: '',
        statusCode: undefined,
      },
      addNewColumn: {
        active: false,
        columnTitle: '',
      },
    });
  };

  return (
    <>
      {updatePositionsState.err.message && <Messages.ErrorMessage message={updatePositionsState.err.message} closeMessage={closeMessage} />}
      <DragDropContextProvider>
        <Droppable droppableId={board._id} direction="horizontal" type="column">
          {dropProvided => (
            <div {...dropProvided.droppableProps} ref={(el) => { dropProvided.innerRef.current = el; boardListContainerRef.current = el; }} className="board-lists-container d-flex align-items-start">

              {board.columns.map((column, index) => (
                <ColumnContainer
                  boardId={board._id}
                  key={column._id}
                  index={index}
                  listTitle={column.title}
                  columnId={column._id}
                  position={column.position}
                  handleError={handleError}
                />
              ))}

              <div className="add-new-column-button-container">
                <AddBoardContent
                  addContent={addColumn}
                  openBtnTitle="Add another column"
                  addBtnTitle="Add Column"
                  containerClass="add-new-column-inputs-container"
                  addBtnClass="add-column-btn"
                  textInputOptions={{
                    textInputName: 'columnTitle',
                    textInputId: 'column-title',
                    textInputClass: 'title-input',
                    textInputPlaceholder: 'Column title...',
                  }}
                />
              </div>

            </div>
          )}
        </Droppable>
      </DragDropContextProvider>
    </>
  );
};

const mapStateToProps = updatePositionsState => ({
  token: updatePositionsState.user.token,
  board: updatePositionsState.board,
});

const mapDispatchToProps = dispatch => ({
  createColumn: (token, boardId, data) => dispatch(boardActions.createColumn(token, boardId, data)),
});


ColumnList.propTypes = propTypes;


export default connect(mapStateToProps, mapDispatchToProps)(ColumnList);
// export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ColumnList));
