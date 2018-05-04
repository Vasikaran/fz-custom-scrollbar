import _Object$assign from "babel-runtime/core-js/object/assign";
import _Object$getPrototypeOf from "babel-runtime/core-js/object/get-prototype-of";
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";
import _possibleConstructorReturn from "babel-runtime/helpers/possibleConstructorReturn";
import _inherits from "babel-runtime/helpers/inherits";
import React, { Component } from "react";
import PropTypes from "prop-types";
import style from "./HorizontalScrollbar.css";
import ScrollTrack from "../ScrollTrack";

var hidden = {
    overflow: "hidden"
};

var HorizontalScrollbar = function (_Component) {
    _inherits(HorizontalScrollbar, _Component);

    function HorizontalScrollbar(props) {
        _classCallCheck(this, HorizontalScrollbar);

        var _this = _possibleConstructorReturn(this, (HorizontalScrollbar.__proto__ || _Object$getPrototypeOf(HorizontalScrollbar)).call(this, props));

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

            var thumbStyle = _Object$assign({}, this.state);

            return !isDefault ? React.createElement(
                "div",
                { className: style.overlay, style: hidden },
                React.createElement(
                    "div",
                    {
                        className: scrollAreaStyle ? scrollAreaStyle + " " + style.scrollableArea : style.scrollableArea,
                        onScroll: this.setThumbLeft,
                        ref: this.setScrollableAreaRef
                    },
                    children
                ),
                React.createElement(ScrollTrack, {
                    thumbStyle: thumbStyle,
                    trackStyle: scrollTrackStyle,
                    scrollThumbStyle: scrollThumbStyle,
                    onThumbClick: this.onThumbClick,
                    onTrackClick: this.onTrackClick,
                    type: "horizontal",
                    setRef: this.setTrackRef,
                    thumbRef: this.setThumbRef
                })
            ) : React.createElement(
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
}(Component);

export default HorizontalScrollbar;


HorizontalScrollbar.defaultProps = {
    isDefault: false
};

HorizontalScrollbar.propTypes = {
    scrollAreaStyle: PropTypes.string,
    scrollTrackStyle: PropTypes.string,
    scrollThumbStyle: PropTypes.string,
    setScrollElementRef: PropTypes.func,
    isRecalculateStyle: PropTypes.bool,
    isDefault: PropTypes.bool
};