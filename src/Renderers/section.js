import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Section extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }
    return <section id={this.componentName}>
      <a name={this.componentName} />
      <h2 id={this.componentName + "_title"}>{this.title}</h2>
      {this.children}
    </section>
  }
}