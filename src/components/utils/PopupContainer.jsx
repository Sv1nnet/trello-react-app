import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/navbar.sass';
import '../../styles/popupContainer.sass';

/*
 *
 * props.targetClasses - array of classNames those could be target of click event and popup would be not closed
 * props.extraClasses - array of extra classes for main component container
 * props.popupToClose - name of state field that presents popup activator
 */

class PopupContainer extends Component {
  constructor(props) {
    super(props);

    this.containerElement = React.createRef();
  }

  state = {
    showPopup: true,
    shouldCloseItself: false,
    mounted: false,
  }

  // When component mounted we need watch if popup component was target of click event. If not we need popup to be closed
  componentDidMount() {
    if (window) {
      window.addEventListener('click', this.windowClick, false);
    }
  }

  // Remove watching click event
  componentWillUnmount() {
    window.removeEventListener('click', this.windowClick, false);
  }

  // If user clicked not this popup component we have to hide it
  windowClick = (event) => {
    const { removeElement, targetClasses, popupToClose } = this.props;
    const { mounted } = this.state;
    const targetIsPopup = targetClasses && !!targetClasses.find(className => event.target.classList.contains(className) || event.target.parentElement.classList.contains(className));

    if (targetIsPopup) {
      return;
    }

    if (mounted && removeElement) removeElement(event, popupToClose);
    else this.setState(state => ({ ...state, mounted: true })); // We need this line because once user icon was clicked popup component also handles this click event and close himself. So we set mounted true after the very first lick event was invoked
  }

  closeSelf = (event) => {
    const { removeElement, popupToClose } = this.props;
    const { mounted } = this.state;

    if (mounted && removeElement) removeElement(event, popupToClose);
    else this.setState(() => ({ shouldCloseItself: true }));
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.shouldCloseItself) return null;

    const { props, containerElement } = this;
    const { children, extraClasses, closeBtn } = props;

    return (
      <div ref={containerElement} className={`dropdown-menu ${extraClasses ? extraClasses.join(' ') : ''} active`}>
        <div className="container-fluid">

          {closeBtn && <FontAwesomeIcon onClick={this.closeSelf} className="popup-close-btn" icon={faTimes} />}

          <div className="row">
            {children}
          </div>

        </div>
      </div>
    );
  }
}

export default PopupContainer;
