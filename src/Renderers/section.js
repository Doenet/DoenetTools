import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Section extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    let heading = null;

    let id = this.componentName + "_title";

    let childrenToRender = this.children;

    if (this.doenetSvData.title) {
      if (this.doenetSvData.level === 0) {
        heading = <h1 id={id}>{this.children[0]}</h1>;
      } else if (this.doenetSvData.level === 1) {
        heading = <h2 id={id}>{this.children[0]}</h2>;
      } else if (this.doenetSvData.level === 2) {
        heading = <h3 id={id}>{this.children[0]}</h3>;
      } else if (this.doenetSvData.level === 3) {
        heading = <h4 id={id}>{this.children[0]}</h4>;
      } else if (this.doenetSvData.level === 4) {
        heading = <h5 id={id}>{this.children[0]}</h5>;
      } else {
        heading = <h6 id={id}>{this.children[0]}</h6>;
      }
      childrenToRender = this.children.slice(1); // remove title
    }

    if (this.doenetSvData.containerTag === "aside") {
      return <aside id={this.componentName} >
        <a name={this.componentName} />
        {heading}
        {childrenToRender}
      </aside>
    } else {
      return <section id={this.componentName} >
        <a name={this.componentName} />
        {heading}
        {childrenToRender}
      </section>
    }
  }
}