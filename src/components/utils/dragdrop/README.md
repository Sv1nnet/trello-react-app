# How Drag and Drop works

## DragDropContext
`DNDContext` has to get columnsWithCards object from `BoardContentContext`. The object contains keys - column ids and plain object as its value.
```js
 // columnsWithCards
 {
   [column._id]: {
     title: column.title, // string
     position: column.position, // number
     cards: [] // filtered array of cards that we got from global state
   }
 }
 ```

 We have to wrap code that contains components wrapped by [Draggble](#Draggable) and [Droppable](#Droppable) containers. Then `DNDContext` provides to `Draggable` components as context value:
  - `dragState` - plain object that contains information about drag event;
  - `dragStart` - function that excecutes when we start dragging an element;
  - `dragEnd` - function that excecutes when we finished dragging an element;
  - `dragUpdate` - function that executes every time we move a dragged element on a new position;

`Droppable` takes `dragState` and `dragUpdate`.

These drag event functions take handlers that user can put in there as the first argument. Handlers have to be passed as a `dragHandlers` in `Draggble` components.

```js
const dragHandlers = {
  onDragStart: function() { },
  onDragUpdate: function() { },
  onDragEnd: function() { }
}
```

Also, we can pass in DragDropContextProvider props itself functions `onDragStart`, `onDragEnd`, `onDragUpdate`.

```js
<DragDropContextProvider
  onDragStart={() => { console.log('drag started'); }}
  onDragEnd={() => { console.log('drag ended'); }}
  onDragUpdate={() => { console.log('drag state updated'); }}
>
```

To handle errors DragDropContextProvider takes in props `handleError` function

```js
<DragDropContextProvider
  handleError={handleError}
>
```


## Draggable
`Draggable` contains mouse event handlers:
 - `onMouseMove` - checks if mouse moved enough to start dragging elements; if it did then starts dragging by executing `dragStart` from `DragDropContext`;
 - `onMouseEnter` - once dragged element moves on another draggable element this function inserts placeholder where it should be inserted and executes `dragUpdate` from `DragDropContext`;
 - `onMouseUp` - removes placeholder and mouse handlers;
 - `onMouseDown` - sets mouse position coords where event occurs; we need this for `onMouseMove`;

 In props it takes dragHandlers as a container for `onDragStart`, `onDragUpdate` and `onDragEnd` events.

 From `DragDropContext` it takes `dragState`, `dragStart`, `dragUpdate` and `dragEnd`. Their purpose is described above.

 Renders function with `provider` and `snapshop` in arguments.
 ```js
 // snapshot
 {
   ...dragState,
   isThisElementDragging: dragState.dragging && dragState.draggableId === draggableId,
 }
 ```


## Droppable
`Droppable` contains mouse event handlers:
 - `onMouseEnter` - every time dragging element enters in `Droppable` container it sets neccessery data in placeholder's data attribute, moves placeholder into self and executes `dragUpdate` from `DragDropContext`;
 - `onMouseUp` - removes placeholder and mouse handlers;

 In props it takes dragHandlers as a container for `onDragStart`, `onDragUpdate` and `onDragEnd` events.

 Renders function with `provider` and `dragState` in arguments.