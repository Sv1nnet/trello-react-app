/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DNDContext from '../utils/dragdrop/DragDropContext';
import boardActions from '../../actions/boardActions';
import Messages from '../utils/Messages';
import ColumnContainer from '../columns/ColumnContainer';
import { ColumnListContext } from '../context/ColumnListContext';
import '../../styles/columnList.sass';
import AddBoardContent from '../utils/AddBoardContent';
import scrollElements from '../../utlis/scrollElements';


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

  const {
    columnContextAPI,
    cardsContextAPI,
  } = useContext(ColumnListContext);

  // const {
  // } = cardsContextAPI;

  // const {
  // } = columnContextAPI;

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

  const scrollBoard = scrollElements([
    {
      elementToScroll: boardListContainerRef,
      scrollIntervals: {
        scrollHorizontalInterval: null,
        scrollVerticaltalInterval: null,
      },
      distanceToStartScrollingX: 150,
      scrollStepX: 15,
      scrollX: true,
    },
  ]);

  const onDragStart = (data) => {
    console.log('onDragStart', data)
    const removeMouseHanlers = () => {
      window.removeEventListener('mousemove', scrollBoard);
      window.removeEventListener('mouseup', scrollBoard);
    };

    if (data.type === 'task') {
      window.addEventListener('mousemove', scrollBoard);
      window.addEventListener('mouseup', removeMouseHanlers);
    }
  };

  const onDragUpdate = (data) => {
    console.log('onDragUpdate', data)
  };

  const onDragEnd = (data) => {
    console.log('onDragEnd', data)
    // if (data.type === 'task') window.removeEventListener('mousemove', scrollBoard);
  };


  return (
    <>
      {updatePositionsState.err.message && <Messages.ErrorMessage message={updatePositionsState.err.message} closeMessage={closeMessage} />}
      <DragDropContext
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <DNDContext>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {provided => (
              <div data-droppable-id={board._id} {...provided.droppableProps} ref={(el) => { provided.innerRef(el); boardListContainerRef.current = el; }} className="board-lists-container d-flex align-items-start">

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
                {provided.placeholder}

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
        </DNDContext>
      </DragDropContext>
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
