import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './ScrollThumb.css';

export default class ScrollThumb extends Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  handleMouseDown(event) {
    let { onThumbClick } = this.props;
    event.persist();
    onThumbClick(event);
  }

  render() {
    let { thumbStyle, className, setRef, handleThumbClick } = this.props;
    return (
      <div
        style={thumbStyle}
        className={
          className ? `${className} ${style.scrollThumb}` : style.scrollThumb
        }
        onMouseDown={this.handleMouseDown}
        onClick={handleThumbClick}
        ref={setRef}
      />
    );
  }
}

ScrollThumb.defaultProps = {
  className: ''
};

//eslint-disable-next-line no-undef
if (__DEVELOPMENT__) {
  ScrollThumb.propTypes = {
    thumbStyle: PropTypes.object.isRequired,
    onThumbClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    handleThumbClick: PropTypes.func.isRequired,
    setRef: PropTypes.func.isRequired
  };
}
