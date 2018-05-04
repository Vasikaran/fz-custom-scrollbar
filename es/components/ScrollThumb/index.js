import _Object$getPrototypeOf from "babel-runtime/core-js/object/get-prototype-of";
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";
import _possibleConstructorReturn from "babel-runtime/helpers/possibleConstructorReturn";
import _inherits from "babel-runtime/helpers/inherits";
import React, { Component } from "react";
import PropTypes from "prop-types";
import style from "./ScrollThumb.css";

var ScrollThumb = function (_Component) {
    _inherits(ScrollThumb, _Component);

    function ScrollThumb(props) {
        _classCallCheck(this, ScrollThumb);

        var _this = _possibleConstructorReturn(this, (ScrollThumb.__proto__ || _Object$getPrototypeOf(ScrollThumb)).call(this, props));

        _this.handleMouseDown = _this.handleMouseDown.bind(_this);
        return _this;
    }

    _createClass(ScrollThumb, [{
        key: "handleMouseDown",
        value: function handleMouseDown(event) {
            var onThumbClick = this.props.onThumbClick;

            event.persist();
            onThumbClick(event);
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                thumbStyle = _props.thumbStyle,
                type = _props.type,
                className = _props.className,
                setRef = _props.setRef,
                handleThumbClick = _props.handleThumbClick;

            return React.createElement("div", {
                style: thumbStyle,
                className: className ? className + " " + style[type] : style[type],
                onMouseDown: this.handleMouseDown,
                onClick: handleThumbClick,
                ref: setRef
            });
        }
    }]);

    return ScrollThumb;
}(Component);

export default ScrollThumb;


ScrollThumb.propTypes = {
    thumbStyle: PropTypes.object,
    onThumbClick: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string,
    handleThumbClick: PropTypes.func,
    setRef: PropTypes.func
};