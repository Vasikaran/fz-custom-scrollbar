"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ScrollTrack = require("./ScrollTrack.css");

var _ScrollTrack2 = _interopRequireDefault(_ScrollTrack);

var _ScrollThumb = require("../ScrollThumb");

var _ScrollThumb2 = _interopRequireDefault(_ScrollThumb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollTrack = function (_Component) {
    _inherits(ScrollTrack, _Component);

    function ScrollTrack(props) {
        _classCallCheck(this, ScrollTrack);

        return _possibleConstructorReturn(this, (ScrollTrack.__proto__ || Object.getPrototypeOf(ScrollTrack)).call(this, props));
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

            return _react2.default.createElement(
                "div",
                {
                    className: trackStyle ? trackStyle + " " + _ScrollTrack2.default[type] : _ScrollTrack2.default[type],
                    onMouseDown: onTrackClick,
                    ref: setRef
                },
                _react2.default.createElement(_ScrollThumb2.default, {
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
}(_react.Component);

exports.default = ScrollTrack;


ScrollTrack.propTypes = {
    thumbStyle: _propTypes2.default.object,
    onThumbClick: _propTypes2.default.func,
    clasName: _propTypes2.default.string,
    type: _propTypes2.default.string,
    trackStyle: _propTypes2.default.string,
    scrollThumbStyle: _propTypes2.default.string,
    handleThumbClick: _propTypes2.default.func,
    thumbRef: _propTypes2.default.func
};