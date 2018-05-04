"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ScrollThumb = require("./ScrollThumb.css");

var _ScrollThumb2 = _interopRequireDefault(_ScrollThumb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollThumb = function (_Component) {
    _inherits(ScrollThumb, _Component);

    function ScrollThumb(props) {
        _classCallCheck(this, ScrollThumb);

        var _this = _possibleConstructorReturn(this, (ScrollThumb.__proto__ || Object.getPrototypeOf(ScrollThumb)).call(this, props));

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

            return _react2.default.createElement("div", {
                style: thumbStyle,
                className: className ? className + " " + _ScrollThumb2.default[type] : _ScrollThumb2.default[type],
                onMouseDown: this.handleMouseDown,
                onClick: handleThumbClick,
                ref: setRef
            });
        }
    }]);

    return ScrollThumb;
}(_react.Component);

exports.default = ScrollThumb;


ScrollThumb.propTypes = {
    thumbStyle: _propTypes2.default.object,
    onThumbClick: _propTypes2.default.func,
    className: _propTypes2.default.string,
    type: _propTypes2.default.string,
    handleThumbClick: _propTypes2.default.func,
    setRef: _propTypes2.default.func
};