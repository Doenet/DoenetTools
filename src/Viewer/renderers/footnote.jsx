import { use } from 'chai';
import React, { useState } from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Footnote extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {isVisible: false};
  }

  handleClick() {
    if (this.state.isVisible == true) {
      this.setState({isVisible: false});
      console.log(this.state.isVisible);
    } else {
      this.setState({isVisible: true});
      console.log(this.state.isVisible)
    }
  }
    
  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    const footnoteMessageStyle = {
          padding: '10px', 
          borderRadius: '5px', 
          backgroundColor: '#e2e2e2',
          display: `static`,
        }
    let footnoteMessage; 
    if (this.state.isVisible) {
      footnoteMessage = <div style={footnoteMessageStyle}>{this.doenetSvData.text}</div>;
    } else {
      footnoteMessage = ''
    }

    const buttonStyle = {
      backgroundColor: 'white',
      border: 'none'
    }

    const footnoteStyle = {
      textDecoration: 'none',
      color: '#1A5A99'
    }
    
    return (
      <>
      <span id={this.componentName}>
        <a name={this.componentName} />
        <sup>
          <button style={buttonStyle} onClick={this.handleClick}>
            <a href='#' title={this.doenetSvData.text} style={footnoteStyle}>[{this.doenetSvData.footnoteTag}]</a>
          </button>
        </sup>
      </span>
      {footnoteMessage}
      </>
    );
  }
}