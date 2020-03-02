/* eslint-disable react-hooks/rules-of-hooks */
// React/Redux components
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Custom components
import Droppable from '../utils/dragdrop/Droppable';
import Messages from '../utils/Messages';
import ColumnContainer from '../columns/ColumnContainer';
import AddBoardContent from '../utils/AddBoardContent';

// Context
import DragDropContextProvider from '../utils/dragdrop/DragDropContext';

// Custom hooks
import useStatus from '../../utlis/hooks/useStatus';

// mapState and actions
import { mapStateToProps } from '../../utlis/reduxMapFunction';
import boardActions from '../../actions/boardActions';

// Styles
import '../../styles/columnList.sass';


const propTypes = {
  token: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
  }).isRequired,
  createColumn: PropTypes.func.isRequired,
};


const ColumnList = ({ createColumn, token, board }) => {
  const statusHook = useStatus();

  const {
    status,
    resetStatus,
    handleSuccess,
    handleError,
  } = statusHook;

  const boardListContainerRef = useRef(null);

  const addColumn = (e, columnTitle) => {
    e.preventDefault();

    if (!columnTitle) {
      const err = { status: 400, message: 'Column title can not be blank' };
      return handleError(err);
    }

    const column = {
      title: columnTitle,
      position: board.columns.length,
    };

    return createColumn(token.token, board._id, column)
      .then(handleSuccess)
      .catch(handleError);
  };

  return (
    <>
      {status.err.message && <Messages.ErrorMessage message={status.err.message} closeMessage={resetStatus} />}
      <DragDropContextProvider
        handleError={handleError}
      >
        <Droppable droppableId={board._id} direction="horizontal" type="column">
          {dropProvided => (
            <div
              {...dropProvided.droppableProps}
              ref={(el) => {
                const { innerRef } = dropProvided;
                innerRef.current = el;
                boardListContainerRef.current = el;
              }}
              className="board-lists-container d-flex align-items-start"
            >

              {board.columns.map((column, index) => (
                <ColumnContainer
                  boardId={board._id}
                  key={column._id}
                  index={index}
                  listTitle={column.title}
                  columnId={column._id}
                  position={column.position}
                  statusHook={statusHook}
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
                    textInputType: 'textarea',
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

const mapDispatchToProps = dispatch => ({
  createColumn: (token, boardId, data) => dispatch(boardActions.createColumn(token, boardId, data)),
});


ColumnList.propTypes = propTypes;


export default connect(mapStateToProps.mapRequestData, mapDispatchToProps)(ColumnList);
