"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _HorizontalScrollbar = require("./HorizontalScrollbar.css");

var _HorizontalScrollbar2 = _interopRequireDefault(_HorizontalScrollbar);

var _ScrollTrack = require("../ScrollTrack");

var _ScrollTrack2 = _interopRequireDefault(_ScrollTrack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hidden = {
    overflow: "hidden"
};

var HorizontalScrollbar = function (_Component) {
    _inherits(HorizontalScrollbar, _Component);

    function HorizontalScrollbar(props) {
        _classCallCheck(this, HorizontalScrollbar);

        var _this = _possibleConstructorReturn(this, (HorizontalScrollbar.__proto__ || Object.getPrototypeOf(HorizontalScrollbar)).call(this, props));

        _this.state = {
            width: "0%",
            left: "0%"
        };

        _this.setScrollableAreaRef = _this.setScrollableAreaRef.bind(_this);
        _this.setTrackRef = _this.setTrackRef.bind(_this);
        _this.setThumbRef = _this.setThumbRef.bind(_this);

        _this.setThumbWidth = _this.setThumbWidth.bind(_this);
        _this.setThumbLeft = _this.setThumbLeft.bind(_this);

        _this.onThumbClick = _this.onThumbClick.bind(_this);
        _this.onLeaveDrag = _this.onLeaveDrag.bind(_this);
        _this.onThumbDragHorizontal = _this.onThumbDragHorizontal.bind(_this);
        _this.onTrackClick = _this.onTrackClick.bind(_this);

        _this.initMutationObserver = _this.initMutationObserver.bind(_this);
        _this.getScrollContainer = _this.getScrollContainer.bind(_this);
        return _this;
    }

    _createClass(HorizontalScrollbar, [{
        key: "onTrackClick",
        value: function onTrackClick(event) {
            var pageX = event.pageX;

            var _thumb$getBoundingCli = this.thumb.getBoundingClientRect(),
                thumbLeft = _thumb$getBoundingCli.left;

            var isClickRight = pageX > thumbLeft;
            var _scrollableArea = this.scrollableArea,
                scrollWidth = _scrollableArea.scrollWidth,
                clientWidth = _scrollableArea.clientWidth;


            if (scrollWidth !== clientWidth) {
                var thumbWidth = this.thumb.clientWidth;
                var trackWidth = this.scrollTrack.clientWidth;

                var scrollRatio = thumbWidth / trackWidth * 100;
                var left = this.state.left;

                var preLeft = Number(left.split("%")[0]);
                var nextLeft = isClickRight ? preLeft + scrollRatio : preLeft - scrollRatio;
                if (isClickRight) {
                    if (nextLeft + scrollRatio >= 100) {
                        nextLeft += 100 - (nextLeft + scrollRatio);
                    }
                } else {
                    nextLeft = nextLeft < 0 ? 0 : nextLeft;
                }
                var scrollLeft = nextLeft / 100 * scrollWidth;
                this.scrollableArea.scrollLeft = scrollLeft;
            }
        }
    }, {
        key: "onThumbClick",
        value: function onThumbClick(event) {
            event.preventDefault();
            this.dragging = false;
            document.addEventListener("mouseup", this.onLeaveDrag);
            document.addEventListener("mousemove", this.onThumbDragHorizontal);
        }
    }, {
        key: "onThumbDragHorizontal",
        value: function onThumbDragHorizontal(event) {
            event.preventDefault();
            var _scrollableArea2 = this.scrollableArea,
                scrollWidth = _scrollableArea2.scrollWidth,
                clientWidth = _scrollableArea2.clientWidth;
            var pageX = event.pageX;

            var delta = pageX - (this.prePageX || 0);
            if (!this.dragging) {
                delta = 0;
                this.dragging = true;
            }
            this.scrollableArea.scrollLeft += delta / (clientWidth / scrollWidth);
            this.prePageX = pageX;
        }
    }, {
        key: "onLeaveDrag",
        value: function onLeaveDrag() {
            event.preventDefault();
            this.dragging = false;
            document.removeEventListener("mousemove", this.onThumbDragHorizontal);
            document.removeEventListener("mouseup", this.onLeaveDrag);
        }
    }, {
        key: "setThumbWidth",
        value: function setThumbWidth() {
            var _scrollableArea3 = this.scrollableArea,
                scrollWidth = _scrollableArea3.scrollWidth,
                clientWidth = _scrollableArea3.clientWidth;

            if (scrollWidth !== clientWidth) {
                var width = clientWidth / scrollWidth * 100 + "%";
                this.setState({ width: width });
            } else {
                var _width = this.state.width;

                if (_width !== "0%") {
                    this.setState({ width: "0%", left: "0%" });
                }
            }
        }
    }, {
        key: "setThumbLeft",
        value: function setThumbLeft() {
            var _scrollableArea4 = this.scrollableArea,
                scrollWidth = _scrollableArea4.scrollWidth,
                clientWidth = _scrollableArea4.clientWidth,
                scrollLeft = _scrollableArea4.scrollLeft;

            if (scrollWidth !== clientWidth) {
                var left = scrollLeft / scrollWidth * 100 + "%";
                this.setState({ left: left });
            }
        }
    }, {
        key: "initMutationObserver",
        value: function initMutationObserver() {
            var _this2 = this;

            var callback = function callback() {
                _this2.setThumbWidth();
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
        key: "setScrollableAreaRef",
        value: function setScrollableAreaRef(element) {
            var setScrollElementRef = this.props.setScrollElementRef;

            setScrollElementRef && setScrollElementRef(element);
            this.scrollableArea = element;
        }
    }, {
        key: "setTrackRef",
        value: function setTrackRef(element) {
            this.scrollTrack = element;
        }
    }, {
        key: "setThumbRef",
        value: function setThumbRef(element) {
            this.thumb = element;
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                scrollAreaStyle = _props.scrollAreaStyle,
                scrollTrackStyle = _props.scrollTrackStyle,
                scrollThumbStyle = _props.scrollThumbStyle,
                children = _props.children,
                isDefault = _props.isDefault;

            var thumbStyle = Object.assign({}, this.state);

            return !isDefault ? _react2.default.createElement(
                "div",
                { className: _HorizontalScrollbar2.default.overlay, style: hidden },
                _react2.default.createElement(
                    "div",
                    {
                        className: scrollAreaStyle ? scrollAreaStyle + " " + _HorizontalScrollbar2.default.scrollableArea : _HorizontalScrollbar2.default.scrollableArea,
                        onScroll: this.setThumbLeft,
                        ref: this.setScrollableAreaRef
                    },
                    children
                ),
                _react2.default.createElement(_ScrollTrack2.default, {
                    thumbStyle: thumbStyle,
                    trackStyle: scrollTrackStyle,
                    scrollThumbStyle: scrollThumbStyle,
                    onThumbClick: this.onThumbClick,
                    onTrackClick: this.onTrackClick,
                    type: "horizontal",
                    setRef: this.setTrackRef,
                    thumbRef: this.setThumbRef
                })
            ) : _react2.default.createElement(
                "span",
                null,
                children
            );
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var isDefault = this.props.isDefault;

            !isDefault && this.setThumbWidth();
            !isDefault && this.initMutationObserver();
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(preProps) {
            var isRecalculateStyle = this.props.isRecalculateStyle;

            if (preProps.isRecalculateStyle !== isRecalculateStyle && isRecalculateStyle) {
                this.setThumbHeight();
                this.setThumbTop();
            }
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            var isDefault = this.props.isDefault;

            !isDefault && this.observer.disconnect();
        }
    }]);

    return HorizontalScrollbar;
}(_react.Component);

exports.default = HorizontalScrollbar;


HorizontalScrollbar.defaultProps = {
    isDefault: false
};

HorizontalScrollbar.propTypes = {
    scrollAreaStyle: _propTypes2.default.string,
    scrollTrackStyle: _propTypes2.default.string,
    scrollThumbStyle: _propTypes2.default.string,
    setScrollElementRef: _propTypes2.default.func,
    isRecalculateStyle: _propTypes2.default.bool,
    isDefault: _propTypes2.default.bool
};