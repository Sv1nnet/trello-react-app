import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import hasParent from '../../utlis/hasParent';
import '../../styles/navbar.sass';
import '../../styles/popupContainer.sass';

/*
 *
 * props.classesToNotClosePopup - array of classNames that could be a target of click event and popup would be not closed
 * props.extraClasses - array of extra classes for main component container
 * props.popupToClose - name of state field that presents popup activator
 */


const propTypes = {
  classesToNotClosePopup: PropTypes.arrayOf(PropTypes.string),
  extraClasses: PropTypes.arrayOf(PropTypes.string),
  style: PropTypes.shape({}),
  popupToClose: PropTypes.string,
  popupContainerRef: PropTypes.shape({
    current: PropTypes.instanceOf(HTMLElement),
  }),
  closeBtn: PropTypes.bool,
};

const defaultProps = {
  classesToNotClosePopup: null,
  popupContainerRef: null,
  extraClasses: null,
  style: {},
  popupToClose: null,
  closeBtn: false,
};


class PopupContainer extends Component {
  constructor(props) {
    super(props);

    this.containerElement = React.createRef(null);
  }

  state = {
    showPopup: true,
    shouldCloseItself: false,
    mounted: false,
  }

  // When component mounted we need watch if popup component was target of click event. If not we need popup to be closed
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener('click', this.windowClick, false);
      this.setState(state => ({ ...state, mounted: true }));
    }, 0);
  }

  // Remove watching click event
  componentWillUnmount() {
    window.removeEventListener('click', this.windowClick, false);
  }

  // If user clicked not this popup component we have to hide it
  windowClick = (e) => {
    let targetIsPopup;
    const { removeElement, classesToNotClosePopup, popupToClose } = this.props;
    const { mounted } = this.state;

    // If we specified array of classes then we check should we close popup by using classesToNotClosePopup. Otherwise we look up popup container in e.target.parents and if we don't find it then popup should be closed
    if (classesToNotClosePopup) {
      targetIsPopup = hasParent(this.containerElement.current, e.target) || !!classesToNotClosePopup.find(className => e.target.classList.contains(className) || e.target.parentElement.classList.contains(className));
    } else {
      targetIsPopup = hasParent(this.containerElement.current, e.target);
    }

    if (targetIsPopup) {
      return;
    }

    if (mounted && removeElement) removeElement(e, popupToClose);
  }

  closeSelf = (e) => {
    const { removeElement, popupToClose } = this.props;
    const { mounted } = this.state;

    if (mounted && removeElement) removeElement(e, popupToClose);
    else this.setState(() => ({ shouldCloseItself: true }));
  }

  render() {
    const { state, props, containerElement } = this;
    const {
      children,
      extraClasses,
      closeBtnExtraClasses,
      closeBtn,
      style,
      popupContainerRef,
    } = props;

    if (state.shouldCloseItself) return null;

    return (
      <div ref={(el) => { containerElement.current = el; if (popupContainerRef) popupContainerRef.current = el; }} style={{ ...style }} className={`dropdown-menu ${extraClasses ? extraClasses.join(' ') : ''} active`}>
        <div className="container-fluid">

          {closeBtn && <FontAwesomeIcon onClick={this.closeSelf} className={`popup-close-btn ${closeBtnExtraClasses ? closeBtnExtraClasses.join(' ') : ''}`} icon={faTimes} />}

          <div className="row">
            {React.Children.map(children, (child) => {
              if (typeof child.type === 'function') {
                return React.cloneElement(child, { ...child.props, popupContainerRef: containerElement });
              }
              return child;
            })}
          </div>

        </div>
      </div>
    );
  }
}


PopupContainer.propTypes = propTypes;
PopupContainer.defaultProps = defaultProps;


export default PopupContainer;
