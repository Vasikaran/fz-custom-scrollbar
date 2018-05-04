import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './Scrollbar.css';
import ScrollTrack from '../ScrollTrack';
import { smoothScroll } from '../../utils';

const hidden = {
  overflow: 'hidden'
};

export default class Scrollbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      height: '0%',
      top: '0%'
    };

    this.setScrollableAreaRef = this.setScrollableAreaRef.bind(this);
    this.setTrackRef = this.setTrackRef.bind(this);
    this.setThumbRef = this.setThumbRef.bind(this);

    this.setThumbHeight = this.setThumbHeight.bind(this);
    this.setThumbTop = this.setThumbTop.bind(this);
    this.setThumpProperties = this.setThumpProperties.bind(this);

    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.debounce = this.debounce.bind(this);

    this.onThumbClick = this.onThumbClick.bind(this);
    this.onTrackClick = this.onTrackClick.bind(this);
    this.onLeaveDrag = this.onLeaveDrag.bind(this);
    this.onThumbDrag = this.onThumbDrag.bind(this);

    this.initMutationObserver = this.initMutationObserver.bind(this);
    this.listenViewPort = this.listenViewPort.bind(this);
    this.onScrollSubscribe = this.onScrollSubscribe.bind(this);
    this.getScrollingElement = this.getScrollingElement.bind(this);
    this.handleSmoothScroll = this.handleSmoothScroll.bind(this);

    this.prePageY = 0;
    this.minThumbHeight = 10;

    this.subscribers = [];
  }

  debounce(func, wait) {
    let timeout;
    return args => {
      clearTimeout(timeout);
      timeout = setTimeout(func.bind(undefined, args), wait);
    };
  }

  listenViewPort() {
    if (!this.subscribers.length) {
      return false;
    }
    this.subscribers.forEach((subscriber, index) => {
      if (!subscriber) {
        return false;
      }
      let { isVisible } = subscriber;
      if (!isVisible) {
        let { element, method, instantUnsubscribe } = subscriber;
        let { clientHeight } = this.scrollableArea;
        let {
          top: scbscriberTop,
          bottom: subscriberBottom
        } = element.getBoundingClientRect();
        let { clientHeight: subscriberHeight } = element;
        let { top: containerTop } = this.scrollableArea.getBoundingClientRect();
        if (
          scbscriberTop - containerTop < clientHeight &&
          (subscriberBottom > containerTop &&
            subscriberBottom - containerTop >= subscriberHeight / 2)
        ) {
          method();
          if (instantUnsubscribe) {
            this.subscribers[index] = undefined;
          } else {
            subscriber.isVisible = true;
          }
        }
      }
    });
    this.subscribers = this.subscribers.filter(subscriber => subscriber);
  }

  onScrollSubscribe(element, method, instantUnsubscribe = false) {
    let subscriber = {
      element,
      method,
      isVisible: false,
      instantUnsubscribe
    };
    this.subscribers.push(subscriber);
    return instantUnsubscribe
      ? null
      : () => {
        let index = this.subscribers.indexOf(subscriber);
        this.subscribers.splice(index, 1);
        return true;
      };
  }

  getScrollingElement() {
    return this.scrollableArea;
  }

  getChildContext() {
    return {
      onScrollSubscribe: this.onScrollSubscribe,
      getScrollingElement: this.getScrollingElement
    };
  }

  onTrackClick(event) {
    let { pageY } = event;
    let { top: thumbTop } = this.thumb.getBoundingClientRect();
    let isClickDown = pageY > thumbTop;
    let { scrollHeight, clientHeight } = this.scrollableArea;

    if (scrollHeight !== clientHeight) {
      let { clientHeight: thumbHeight } = this.thumb;
      let { clientHeight: trackHeight } = this.scrollTrack;
      let scrollRatio = thumbHeight / trackHeight * 100;
      let { top } = this.state;
      let preTop = Number(top.split('%')[0]);
      let nextTop = isClickDown ? preTop + scrollRatio : preTop - scrollRatio;
      if (isClickDown) {
        if (nextTop + scrollRatio >= 100) {
          nextTop += 100 - (nextTop + scrollRatio);
        }
      } else {
        nextTop = nextTop < 0 ? 0 : nextTop;
      }
      let scrollTop = nextTop / 100 * scrollHeight;
      this.scrollableArea.scrollTop = scrollTop;
    }
  }

  handleDocumentClick(event) {
    let { handleThumbClick } = this.props;
    handleThumbClick && handleThumbClick(event);
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  onThumbClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragging = false;
    document.addEventListener('click', this.handleDocumentClick, true);
    document.addEventListener('mouseup', this.onLeaveDrag);
    document.addEventListener('mousemove', this.onThumbDrag);
  }

  onThumbDrag(event) {
    event.preventDefault();
    let { scrollHeight, clientHeight } = this.scrollableArea;
    let { pageY } = event;
    let delta = pageY - this.prePageY;
    if (!this.dragging) {
      delta = 0;
      this.dragging = true;
    }
    this.scrollableArea.scrollTop += delta / (clientHeight / scrollHeight);
    this.prePageY = pageY;
  }

  onLeaveDrag(event) {
    event.preventDefault();
    document.removeEventListener('mousemove', this.onThumbDrag);
    document.removeEventListener('mouseup', this.onLeaveDrag);
  }

  setThumbHeight() {
    let { scrollHeight, clientHeight } = this.scrollableArea;
    if (scrollHeight !== clientHeight) {
      let { minThumbHeight } = this.props;
      let height = clientHeight / scrollHeight * 100;
      let nextState = { height: `${height}%` };
      if (height < minThumbHeight) {
        nextState.height = `${minThumbHeight}%`;
      }
      this.setState(nextState);
    } else {
      let { height } = this.state;
      if (height !== '0%') {
        this.setState({ height: '0%', top: '0%' });
      }
    }
  }

  setThumbTop() {
    let { scrollHeight, scrollTop, clientHeight } = this.scrollableArea;
    if (scrollHeight !== clientHeight) {
      let { height: size } = this.state;
      let [height] = size.split('%');

      scrollHeight -= clientHeight;
      let ratio = (clientHeight * 100 - height) / 100 / scrollHeight;
      let top = scrollTop * ratio;

      top = top / clientHeight * (100 - height);
      this.setState({ top: `${top}%` });
    }
  }

  initMutationObserver() {
    let callback = () => {
      this.setThumpProperties();
    };

    this.observer = new MutationObserver(callback);
    this.observer.observe(this.scrollableArea, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
  }

  setThumpProperties() {
    this.setThumbHeight();
    this.setThumbTop();
  }

  handleScroll() {
    let { needLazyLoading, isDefault } = this.props;
    if (!isDefault) {
      this.setThumbTop();
    }
    if (needLazyLoading) {
      this.lazyListenViewPort();
    }
  }

  handleResize() {
    let { needLazyLoading } = this.props;
    this.setThumpProperties();
    if (needLazyLoading) {
      this.lazyListenViewPort();
    }
  }

  handleSmoothScroll(input) {
    if (!input.element) {
      input.element = this.scrollableArea;
    }
    smoothScroll(input);
  }

  setScrollableAreaRef(element) {
    let { setScrollElementRef } = this.props;
    setScrollElementRef && setScrollElementRef(element);
    this.scrollableArea = element;
  }

  setTrackRef(element) {
    this.scrollTrack = element;
  }

  setThumbRef(element) {
    this.thumb = element;
  }

  render() {
    let {
      scrollAreaStyle,
      scrollTrackStyle,
      scrollThumbStyle,
      children,
      isDefault,
      handleThumbClick,
      isTrackVisible
    } = this.props;
    let thumbStyle = Object.assign({}, this.state);

    return !isDefault ? (
      <div className={style.overlay} style={hidden}>
        <div
          className={
            scrollAreaStyle
              ? `${scrollAreaStyle} ${style.scrollableArea}`
              : style.scrollableArea
          }
          onScroll={this.handleScroll}
          ref={this.setScrollableAreaRef}
        >
          {children}
        </div>
        <ScrollTrack
          thumbStyle={thumbStyle}
          trackStyle={scrollTrackStyle}
          scrollThumbStyle={scrollThumbStyle}
          onThumbClick={this.onThumbClick}
          onTrackClick={isTrackVisible ? this.onTrackClick : null}
          setRef={this.setTrackRef}
          thumbRef={this.setThumbRef}
          handleThumbClick={handleThumbClick}
        />
      </div>
    ) : (
      <div
        className={
          scrollAreaStyle
            ? `${scrollAreaStyle} ${style.scrollableAreaDefault}`
            : style.scrollableAreaDefault
        }
        ref={this.setScrollableAreaRef}
      >
        {children}
      </div>
    );
  }

  componentDidMount() {
    let { isDefault, delay } = this.props;
    if (!isDefault) {
      this.setThumbHeight();
      this.initMutationObserver();
    }
    let { smoothScrollFunc, needLazyLoading } = this.props;
    smoothScrollFunc && smoothScrollFunc(this.handleSmoothScroll);
    if (needLazyLoading) {
      this.lazyListenViewPort = this.debounce(this.listenViewPort, delay);
      this.listenViewPort();
    }
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate(preProps) {
    let { isDefault } = this.props;
    if (!isDefault) {
      let { canBeRecalculateStyle } = this.props;
      if (
        preProps.canBeRecalculateStyle !== canBeRecalculateStyle &&
        canBeRecalculateStyle
      ) {
        this.setThumpProperties();
      }
    }
  }

  componentWillUnmount() {
    let { isDefault } = this.props;
    if (!isDefault) {
      this.observer.disconnect();
    }
    window.removeEventListener('resize', this.handleResize);
  }
}

Scrollbar.childContextTypes = {
  onScrollSubscribe: PropTypes.func,
  getScrollingElement: PropTypes.func
};

Scrollbar.defaultProps = {
  isDefault: false,
  delay: 100,
  minThumbHeight: 10,
  needLazyLoading: false,
  isTrackVisible: true,
  handleThumbClick: event => {
    event.stopPropagation && event.stopPropagation();
    event.nativeEvent &&
      event.nativeEvent.stopImmediatePropagation &&
      event.nativeEvent.stopImmediatePropagation();
  }
};

Scrollbar.defaultProps = {
  scrollAreaStyle: '',
  setScrollElementRef: () => false,
  canBeRecalculateStyle: false,
  smoothScrollFunc: () => false
};

//eslint-disable-next-line no-undef
if (__DEVELOPMENT__) {
  Scrollbar.propTypes = {
    scrollAreaStyle: PropTypes.string,
    scrollTrackStyle: PropTypes.string.isRequired,
    scrollThumbStyle: PropTypes.string.isRequired,
    setScrollElementRef: PropTypes.func,
    canBeRecalculateStyle: PropTypes.bool,
    isDefault: PropTypes.bool,
    delay: PropTypes.number,
    minThumbHeight: PropTypes.number,
    smoothScrollFunc: PropTypes.func,
    needLazyLoading: PropTypes.bool,
    handleThumbClick: PropTypes.func,
    isTrackVisible: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  };
}
