import _Object$assign from 'babel-runtime/core-js/object/assign';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './VerticalScrollbar.css';
import ScrollTrack from '../ScrollTrack';
import { smoothScroll } from '../../utils';

var hidden = {
	overflow: 'hidden'
};

var VerticalScrollbar = function (_Component) {
	_inherits(VerticalScrollbar, _Component);

	function VerticalScrollbar(props) {
		_classCallCheck(this, VerticalScrollbar);

		var _this = _possibleConstructorReturn(this, (VerticalScrollbar.__proto__ || _Object$getPrototypeOf(VerticalScrollbar)).call(this, props));

		_this.state = {
			height: '0%',
			top: '0%'
		};

		_this.setScrollableAreaRef = _this.setScrollableAreaRef.bind(_this);
		_this.setTrackRef = _this.setTrackRef.bind(_this);
		_this.setThumbRef = _this.setThumbRef.bind(_this);

		_this.setThumbHeight = _this.setThumbHeight.bind(_this);
		_this.setThumbTop = _this.setThumbTop.bind(_this);
		_this.setThumpProperties = _this.setThumpProperties.bind(_this);

		_this.handleScroll = _this.handleScroll.bind(_this);
		_this.handleResize = _this.handleResize.bind(_this);
		_this.handleDocumentClick = _this.handleDocumentClick.bind(_this);
		_this.debounce = _this.debounce.bind(_this);

		_this.onThumbClick = _this.onThumbClick.bind(_this);
		_this.onTrackClick = _this.onTrackClick.bind(_this);
		_this.onLeaveDrag = _this.onLeaveDrag.bind(_this);
		_this.onThumbDrag = _this.onThumbDrag.bind(_this);

		_this.initMutationObserver = _this.initMutationObserver.bind(_this);
		_this.listenViewPort = _this.listenViewPort.bind(_this);
		_this.onScrollSubscribe = _this.onScrollSubscribe.bind(_this);
		_this.getScrollingElement = _this.getScrollingElement.bind(_this);
		_this.handleSmoothScroll = _this.handleSmoothScroll.bind(_this);

		_this.prePageY = 0;
		_this.minThumbHeight = 10;

		_this.subscribers = [];
		return _this;
	}

	_createClass(VerticalScrollbar, [{
		key: 'debounce',
		value: function debounce(func, wait) {
			var timeout = void 0;
			return function (args) {
				clearTimeout(timeout);
				timeout = setTimeout(func.bind(undefined, args), wait);
			};
		}
	}, {
		key: 'listenViewPort',
		value: function listenViewPort() {
			var _this2 = this;

			if (!this.subscribers.length) {
				return false;
			}
			this.subscribers.forEach(function (subscriber, index) {
				if (!subscriber) {
					return false;
				}
				var isVisible = subscriber.isVisible;

				if (!isVisible) {
					var element = subscriber.element,
					    method = subscriber.method,
					    instantUnsubscribe = subscriber.instantUnsubscribe;
					var clientHeight = _this2.scrollableArea.clientHeight;

					var _element$getBoundingC = element.getBoundingClientRect(),
					    scbscriberTop = _element$getBoundingC.top,
					    subscriberBottom = _element$getBoundingC.bottom;

					var subscriberHeight = element.clientHeight;

					var _scrollableArea$getBo = _this2.scrollableArea.getBoundingClientRect(),
					    containerTop = _scrollableArea$getBo.top;

					if (scbscriberTop - containerTop < clientHeight && subscriberBottom > containerTop && subscriberBottom - containerTop >= subscriberHeight / 2) {
						method();
						if (instantUnsubscribe) {
							_this2.subscribers[index] = undefined;
						} else {
							subscriber.isVisible = true;
						}
					}
				}
			});
			this.subscribers = this.subscribers.filter(function (subscriber) {
				return subscriber;
			});
		}
	}, {
		key: 'onScrollSubscribe',
		value: function onScrollSubscribe(element, method) {
			var _this3 = this;

			var instantUnsubscribe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var subscriber = {
				element: element,
				method: method,
				isVisible: false,
				instantUnsubscribe: instantUnsubscribe
			};
			this.subscribers.push(subscriber);
			return instantUnsubscribe ? null : function () {
				var index = _this3.subscribers.indexOf(subscriber);
				_this3.subscribers.splice(index, 1);
				return true;
			};
		}
	}, {
		key: 'getScrollingElement',
		value: function getScrollingElement() {
			return this.scrollableArea;
		}
	}, {
		key: 'getChildContext',
		value: function getChildContext() {
			return {
				onScrollSubscribe: this.onScrollSubscribe,
				getScrollingElement: this.getScrollingElement
			};
		}
	}, {
		key: 'onTrackClick',
		value: function onTrackClick(event) {
			var pageY = event.pageY;

			var _thumb$getBoundingCli = this.thumb.getBoundingClientRect(),
			    thumbTop = _thumb$getBoundingCli.top;

			var isClickDown = pageY > thumbTop;
			var _scrollableArea = this.scrollableArea,
			    scrollHeight = _scrollableArea.scrollHeight,
			    clientHeight = _scrollableArea.clientHeight;


			if (scrollHeight !== clientHeight) {
				var thumbHeight = this.thumb.clientHeight;
				var trackHeight = this.scrollTrack.clientHeight;

				var scrollRatio = thumbHeight / trackHeight * 100;
				var top = this.state.top;

				var preTop = Number(top.split('%')[0]);
				var nextTop = isClickDown ? preTop + scrollRatio : preTop - scrollRatio;
				if (isClickDown) {
					if (nextTop + scrollRatio >= 100) {
						nextTop += 100 - (nextTop + scrollRatio);
					}
				} else {
					nextTop = nextTop < 0 ? 0 : nextTop;
				}
				var scrollTop = nextTop / 100 * scrollHeight;
				this.scrollableArea.scrollTop = scrollTop;
			}
		}
	}, {
		key: 'handleDocumentClick',
		value: function handleDocumentClick(event) {
			var handleThumbClick = this.props.handleThumbClick;

			handleThumbClick && handleThumbClick(event);
			document.removeEventListener('click', this.handleDocumentClick, true);
		}
	}, {
		key: 'onThumbClick',
		value: function onThumbClick(event) {
			event.preventDefault();
			event.stopPropagation();
			this.dragging = false;
			document.addEventListener('click', this.handleDocumentClick, true);
			document.addEventListener('mouseup', this.onLeaveDrag);
			document.addEventListener('mousemove', this.onThumbDrag);
		}
	}, {
		key: 'onThumbDrag',
		value: function onThumbDrag(event) {
			event.preventDefault();
			var _scrollableArea2 = this.scrollableArea,
			    scrollHeight = _scrollableArea2.scrollHeight,
			    clientHeight = _scrollableArea2.clientHeight;
			var pageY = event.pageY;

			var delta = pageY - this.prePageY;
			if (!this.dragging) {
				delta = 0;
				this.dragging = true;
			}
			this.scrollableArea.scrollTop += delta / (clientHeight / scrollHeight);
			this.prePageY = pageY;
		}
	}, {
		key: 'onLeaveDrag',
		value: function onLeaveDrag(event) {
			event.preventDefault();
			document.removeEventListener('mousemove', this.onThumbDrag);
			document.removeEventListener('mouseup', this.onLeaveDrag);
		}
	}, {
		key: 'setThumbHeight',
		value: function setThumbHeight() {
			var _scrollableArea3 = this.scrollableArea,
			    scrollHeight = _scrollableArea3.scrollHeight,
			    clientHeight = _scrollableArea3.clientHeight;

			if (scrollHeight !== clientHeight) {
				var minThumbHeight = this.props.minThumbHeight;

				var height = clientHeight / scrollHeight * 100;
				var nextState = { height: height + '%' };
				if (height < minThumbHeight) {
					nextState.height = minThumbHeight + '%';
				}
				this.setState(nextState);
			} else {
				var _height = this.state.height;

				if (_height !== '0%') {
					this.setState({ height: '0%', top: '0%' });
				}
			}
		}
	}, {
		key: 'setThumbTop',
		value: function setThumbTop() {
			var _scrollableArea4 = this.scrollableArea,
			    scrollHeight = _scrollableArea4.scrollHeight,
			    scrollTop = _scrollableArea4.scrollTop,
			    clientHeight = _scrollableArea4.clientHeight;

			if (scrollHeight !== clientHeight) {
				var height = this.state.height;

				height = height.split('%')[0];

				scrollHeight -= clientHeight;
				var ratio = (clientHeight * 100 - height) / 100 / scrollHeight;
				var top = scrollTop * ratio;

				top = top / clientHeight * (100 - height);
				this.setState({ top: top + '%' });
			}
		}
	}, {
		key: 'initMutationObserver',
		value: function initMutationObserver() {
			var _this4 = this;

			var callback = function callback() {
				_this4.setThumpProperties();
			};

			this.observer = new MutationObserver(callback);
			this.observer.observe(this.scrollableArea, {
				childList: true,
				subtree: true,
				characterData: true,
				attributes: true
			});
		}
	}, {
		key: 'setThumpProperties',
		value: function setThumpProperties() {
			this.setThumbHeight();
			this.setThumbTop();
		}
	}, {
		key: 'handleScroll',
		value: function handleScroll() {
			var _props = this.props,
			    needLazyLoading = _props.needLazyLoading,
			    isDefault = _props.isDefault;

			if (!isDefault) {
				this.setThumbTop();
			}
			if (needLazyLoading) {
				this.lazyListenViewPort();
			}
		}
	}, {
		key: 'handleResize',
		value: function handleResize() {
			var needLazyLoading = this.props.needLazyLoading;

			this.setThumpProperties();
			if (needLazyLoading) {
				this.lazyListenViewPort();
			}
		}
	}, {
		key: 'handleSmoothScroll',
		value: function handleSmoothScroll(input) {
			if (!input.element) {
				input.element = this.scrollableArea;
			}
			smoothScroll(input);
		}
	}, {
		key: 'setScrollableAreaRef',
		value: function setScrollableAreaRef(element) {
			var setScrollElementRef = this.props.setScrollElementRef;

			setScrollElementRef && setScrollElementRef(element);
			this.scrollableArea = element;
		}
	}, {
		key: 'setTrackRef',
		value: function setTrackRef(element) {
			this.scrollTrack = element;
		}
	}, {
		key: 'setThumbRef',
		value: function setThumbRef(element) {
			this.thumb = element;
		}
	}, {
		key: 'render',
		value: function render() {
			var _props2 = this.props,
			    scrollAreaStyle = _props2.scrollAreaStyle,
			    scrollTrackStyle = _props2.scrollTrackStyle,
			    scrollThumbStyle = _props2.scrollThumbStyle,
			    children = _props2.children,
			    isDefault = _props2.isDefault,
			    handleThumbClick = _props2.handleThumbClick,
			    isTrackVisible = _props2.isTrackVisible;

			var thumbStyle = _Object$assign({}, this.state);

			return !isDefault ? React.createElement(
				'div',
				{ className: style.overlay, style: hidden },
				React.createElement(
					'div',
					{
						className: scrollAreaStyle ? scrollAreaStyle + ' ' + style.scrollableArea : style.scrollableArea,
						onScroll: this.handleScroll,
						ref: this.setScrollableAreaRef
					},
					children
				),
				React.createElement(ScrollTrack, {
					thumbStyle: thumbStyle,
					trackStyle: scrollTrackStyle,
					scrollThumbStyle: scrollThumbStyle,
					onThumbClick: this.onThumbClick,
					onTrackClick: isTrackVisible ? this.onTrackClick : null,
					type: 'vertical',
					setRef: this.setTrackRef,
					thumbRef: this.setThumbRef,
					handleThumbClick: handleThumbClick
				})
			) : React.createElement(
				'div',
				{
					className: scrollAreaStyle ? scrollAreaStyle + ' ' + style.scrollableAreaDefault : style.scrollableAreaDefault,
					ref: this.setScrollableAreaRef
				},
				children
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _props3 = this.props,
			    isDefault = _props3.isDefault,
			    delay = _props3.delay;

			if (!isDefault) {
				this.setThumbHeight();
				this.initMutationObserver();
			}
			var _props4 = this.props,
			    smoothScrollFunc = _props4.smoothScrollFunc,
			    needLazyLoading = _props4.needLazyLoading;

			smoothScrollFunc && smoothScrollFunc(this.handleSmoothScroll);
			if (needLazyLoading) {
				this.lazyListenViewPort = this.debounce(this.listenViewPort, delay);
				this.listenViewPort();
			}
			window.addEventListener('resize', this.handleResize);
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate(preProps) {
			var isDefault = this.props.isDefault;

			if (!isDefault) {
				var isRecalculateStyle = this.props.isRecalculateStyle;

				if (preProps.isRecalculateStyle !== isRecalculateStyle && isRecalculateStyle) {
					this.setThumpProperties();
				}
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			var isDefault = this.props.isDefault;

			if (!isDefault) {
				this.observer.disconnect();
			}
			window.removeEventListener('resize', this.handleResize);
		}
	}]);

	return VerticalScrollbar;
}(Component);

export default VerticalScrollbar;


VerticalScrollbar.childContextTypes = {
	onScrollSubscribe: PropTypes.func,
	getScrollingElement: PropTypes.func
};

VerticalScrollbar.defaultProps = {
	isDefault: false,
	delay: 100,
	minThumbHeight: 10,
	needLazyLoading: false,
	isTrackVisible: true,
	handleThumbClick: function handleThumbClick(event) {
		event.stopPropagation && event.stopPropagation();
		event.nativeEvent && event.nativeEvent.stopImmediatePropagation && event.nativeEvent.stopImmediatePropagation();
	}
};

VerticalScrollbar.propTypes = {
	scrollAreaStyle: PropTypes.string,
	scrollTrackStyle: PropTypes.string,
	scrollThumbStyle: PropTypes.string,
	setScrollElementRef: PropTypes.func,
	isRecalculateStyle: PropTypes.bool,
	isDefault: PropTypes.bool,
	delay: PropTypes.number,
	minThumbHeight: PropTypes.number,
	smoothScrollFunc: PropTypes.func,
	needLazyLoading: PropTypes.bool,
	handleThumbClick: PropTypes.func,
	isTrackVisible: PropTypes.bool
};