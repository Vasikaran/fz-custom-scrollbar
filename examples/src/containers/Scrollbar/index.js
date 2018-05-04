/* eslint-disable */
import React, { Component } from 'react';
import style from './index.css';
import PropTypes from 'prop-types';

import { Scrollbar } from '../../../../src';

let content = '#Text';
let contents = [];
for (let i = 0; i < 1000; i++) {
  contents.push(content + ' : ' + i);
}

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.content
    };
    this.handleShow = this.handleShow.bind(this);
  }

  handleShow() {
    this.setState({
      text: 'Hello!'
    });
  }

  render() {
    let { text } = this.state;
    return (
      <div
        ref={text => {
          this.text = text;
        }}
        className={style.content}
      >
        {text}
      </div>
    );
  }

  componentDidMount() {
    let { onScrollSubscribe } = this.context;
    this.unsubscribe = onScrollSubscribe(this.text, this.handleShow, true);
  }
}

Text.contextTypes = {
  onScrollSubscribe: PropTypes.func
};

Text.propTypes = {
  content: PropTypes.string
};

class Content extends Component {
  render() {
    let { contents } = this.props;
    return (
      <div>
        {contents.map((content, id) => <Text key={id} content={content} />)}
      </div>
    );
  }
}

export default class Vertical extends Component {
  constructor(props) {
    super(props);
    this.smoothScroll = this.smoothScroll.bind(this);
  }

  smoothScroll(func) {
    window.smoothScroll = func;
  }

  render() {
    let { isDefault } = this.props;
    return (
      <div className={style.vertical}>
        <Scrollbar
          smoothScrollFunc={this.smoothScroll}
          minThumbHeight={10}
          scrollTrackStyle={style.scrollTrackStyle}
          scrollThumbStyle={style.scrollThumbStyle}
          isDefault={isDefault}
        >
          <Content contents={contents} />
        </Scrollbar>
      </div>
    );
  }
}
