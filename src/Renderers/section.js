import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Section extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    let heading = null;

    let id = this.componentName + "_title";

    if (this.doenetSvData.title) {
      if (this.doenetSvData.level === 0) {
        heading = <h1 id={id}>{this.doenetSvData.title}</h1>;
      } else if (this.doenetSvData.level === 1) {
        heading = <h2 id={id}>{this.doenetSvData.title}</h2>;
      } else if (this.doenetSvData.level === 2) {
        heading = <h3 id={id}>{this.doenetSvData.title}</h3>;
      } else if (this.doenetSvData.level === 3) {
        heading = <h4 id={id}>{this.doenetSvData.title}</h4>;
      } else if (this.doenetSvData.level === 4) {
        heading = <h5 id={id}>{this.doenetSvData.title}</h5>;
      } else {
        heading = <h6 id={id}>{this.doenetSvData.title}</h6>;
      }
    }

    if (this.doenetSvData.containerTag === "aside") {
      return <aside id={this.componentName} >
        <a name={this.componentName} />
        {heading}
        {this.children}
      </aside>
    } else {
      return <section id={this.componentName} >
        <a name={this.componentName} />
        {heading}
        {this.children}
      </section>
    }
  }
}