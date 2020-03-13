## TextInput
This component provides input element with `text` or `textarea` type. Contains two icons - cross and magnifier. Takes next props:
 - hideSearchBtn - provide this prop to hide magnifier icon (bool);
 - hideCrossBtn - provide this prop to hide cross icon (bool);
 - inputType - type of input you need (string); default `text`;
 - textColor - color of text inside of input (string);
 - inputValue - value that placed in input and changing when onChange event occurs (string) (required);
 - onChange - onChange event handler (function) (required);
 - placeholder - placeholder for input (string);
 - maxLength - max length for input value (number);
 - id - input id (string);
 - name - input name (string);
 - classList - list of classes for input (string);
 - containerClassList - list of classes for input container (string);
 - verticalPadding - X and Y padding (number); this value responses for height of `textarea` input;
 - focusAfterCleared - should input be focused after its value has been cleared by pressing cross button (bool);
 - focusAfterActivated - should input be focused after it has been mounted (bool);
 - onSearchBtnClick - cross button click handler;
 - selectOnMounted - should value in input be selected after input has been mounted (bool);
 - innerRef - ref object for input element (ref object);

 ## Loader
 This component used for displaying loading status. Takes props:
  - bg - should background be displayed (bool);
  - bgStyles - object that presents style attribute for background (object);
  - bgClasses - array of classes for background (array of strings);
  - style - object that presents style attribute for loader container (object);

Loader exports object with two components:
 - FormLoader - loader that was created to be placed inside of form or other elements;
 - PageLoader - loader that is displayed over the whole page;

 ## PopupContainer
 This component used as container for popup content. If user clicked not on opened popup it will be closed. Takes props:
  - classesToNotClosePopup - array of classes (array of strings); clicking on elements that contain at least one of those classes won't close popup;
  - extraClasses - array of classes (array of string); these classes will be applied to a popup container;
  - style - style object for popup container (object);
  - popupToClose - if we have several popups in one Component-container and we manage their opening via state we provide name of popup (name of state field for popup) to say to popups Container-container what popup we want to close (string);
  - popupContainerRef - ref object for popup container (ref object);
  - closeBtn - should close button be displayed (bool);
  - removeElement - function that closes popup (function); popupToClose will be passed as the second argument;

## Messages
Provides several types of message:
 - ErrorMessage - has red borders and header;
 - InfoMessage - has blue borders and header;
 - SuccessMessage - has green borders and header;
 - QuestionMessage - can have three types of color and serves for ask a user a question;

#### ErrorMessage, InfoMessage, SuccessMessage
These components can display one button with text "Ok". Takes props:
 - title - title for Message header (string);
 - message - message to show to user (string) (required);
 - closeMessage - function to close Message (function); executes on button pressed;
 - styles - style object for Message container (object);
 - loadingTextAnimation - display three dots at the end of message (e.g. if we use Message to show loading message) (bool);
 - dataForClosingMessage - data we pass into closeMessage function (any);
 - bgPosition - background position CSS property (string);

#### QuestionMessage
This component has two buttons - "Yes" and "No"; Takes props:
 - type - type of question (string); can be `error`, `info` or `success`; default `info`;
 - message - message to display to user (string) (required);
 - answer - object with answer handlers (object) (required):
    - positive - "Yes" answer handler (function) (required);
    - negative - "No" answer handler (function) (requires);
 - styles - style object for Message container (object);
 - bgPosition - background position CSS property (string);
