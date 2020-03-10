import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class P extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.createChildren();
  }

  render() {
    return <p id={this.componentName}><a name={this.componentName} />{this.children}</p>
  }
}