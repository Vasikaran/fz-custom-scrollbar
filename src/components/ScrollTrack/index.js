import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './ScrollTrack.css';
import ScrollThumb from '../ScrollThumb';

export default class ScrollTrack extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    let {
      onThumbClick,
      thumbStyle,
      trackStyle,
      scrollThumbStyle,
      onTrackClick,
      setRef,
      thumbRef,
      handleThumbClick
    } = this.props;
    return (
      <div
        className={
          trackStyle ? `${trackStyle} ${style.scrollTrack}` : style.scrollTrack
        }
        onMouseDown={onTrackClick}
        ref={setRef}
      >
        <ScrollThumb
          thumbStyle={thumbStyle}
          className={scrollThumbStyle}
          onThumbClick={onThumbClick}
          setRef={thumbRef}
          handleThumbClick={handleThumbClick}
        />
      </div>
    );
  }
}

ScrollTrack.defaultProps = {
  className: '',
  handleThumbClick: () => false,
  onTrackClick: () => false
};

//eslint-disable-next-line no-undef
if (__DEVELOPMENT__) {
  ScrollTrack.propTypes = {
    thumbStyle: PropTypes.object.isRequired,
    onThumbClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    trackStyle: PropTypes.string.isRequired,
    scrollThumbStyle: PropTypes.string.isRequired,
    handleThumbClick: PropTypes.func,
    thumbRef: PropTypes.func.isRequired,
    onTrackClick: PropTypes.func,
    setRef: PropTypes.func.isRequired
  };
}
