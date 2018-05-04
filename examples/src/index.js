/* eslint-disable */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Scrollbar from './containers/Scrollbar';

import style from './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    };
    this.toggleView = this.toggleView.bind(this);
  }

  toggleView() {
    let { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    });
  }

  render() {
    let { isOpen } = this.state;
    return (
      <div className={style.root}>
        <button onClick={this.toggleView}>Toggle Button</button>
        <button
          onClick={() => {
            window.smoothScroll &&
              window.smoothScroll({
                duration: 500
              });
          }}
        >
          Go Top
        </button>
        <button
          onClick={() => {
            window.smoothScroll &&
              window.smoothScroll({
                duration: 700,
                endPoint: 29000
              });
          }}
        >
          Go Bottom
        </button>
        {isOpen && <Scrollbar />}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('output'));
