import _Object$getPrototypeOf from "babel-runtime/core-js/object/get-prototype-of";
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";
import _possibleConstructorReturn from "babel-runtime/helpers/possibleConstructorReturn";
import _inherits from "babel-runtime/helpers/inherits";
import React, { Component } from "react";
import PropTypes from "prop-types";
import style from "./ScrollTrack.css";
import ScrollThumb from "../ScrollThumb";

var ScrollTrack = function (_Component) {
    _inherits(ScrollTrack, _Component);

    function ScrollTrack(props) {
        _classCallCheck(this, ScrollTrack);

        return _possibleConstructorReturn(this, (ScrollTrack.__proto__ || _Object$getPrototypeOf(ScrollTrack)).call(this, props));
    }

    _createClass(ScrollTrack, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                onThumbClick = _props.onThumbClick,
                thumbStyle = _props.thumbStyle,
                trackStyle = _props.trackStyle,
                type = _props.type,
                scrollThumbStyle = _props.scrollThumbStyle,
                onTrackClick = _props.onTrackClick,
                setRef = _props.setRef,
                thumbRef = _props.thumbRef,
                handleThumbClick = _props.handleThumbClick;

            return React.createElement(
                "div",
                {
                    className: trackStyle ? trackStyle + " " + style[type] : style[type],
                    onMouseDown: onTrackClick,
                    ref: setRef
                },
                React.createElement(ScrollThumb, {
                    thumbStyle: thumbStyle,
                    className: scrollThumbStyle,
                    type: type,
                    onThumbClick: onThumbClick,
                    setRef: thumbRef,
                    handleThumbClick: handleThumbClick
                })
            );
        }
    }]);

    return ScrollTrack;
}(Component);

export default ScrollTrack;


ScrollTrack.propTypes = {
    thumbStyle: PropTypes.object,
    onThumbClick: PropTypes.func,
    clasName: PropTypes.string,
    type: PropTypes.string,
    trackStyle: PropTypes.string,
    scrollThumbStyle: PropTypes.string,
    handleThumbClick: PropTypes.func,
    thumbRef: PropTypes.func
};