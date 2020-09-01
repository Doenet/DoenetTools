import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import "./spinningLoader.css";

class SpinningLoader extends React.Component {
  constructor(props) {
    super(props);
    this.enableLoader = this.enableLoader.bind(this);

    this.state = {
      displayLoader: false,
    };

    this.timer = setTimeout(this.enableLoader, 250);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  enableLoader() {
    this.setState({displayLoader: true});
  }

  render() {
    const {displayLoader} = this.state;

    if (!displayLoader) {
      return null;
    }

    return <FontAwesomeIcon style={{animation: `spin 1.5s linear infinite, spinnerColor 2s linear infinite`, 
                                fontSize:"35px"}} icon={faSpinner}/>
  }
}

export default SpinningLoader;