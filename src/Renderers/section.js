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

    let title;
    if (this.doenetSvData.titleDefinedByChildren) {
      title = this.children[0]
      childrenToRender = this.children.slice(1); // remove title
    } else {
      title = this.doenetSvData.title;
    }

    if (this.doenetSvData.level === 0) {
      heading = <h1 id={id}>{title}</h1>;
    } else if (this.doenetSvData.level === 1) {
      heading = <h2 id={id}>{title}</h2>;
    } else if (this.doenetSvData.level === 2) {
      heading = <h3 id={id}>{title}</h3>;
    } else if (this.doenetSvData.level === 3) {
      heading = <h4 id={id}>{title}</h4>;
    } else if (this.doenetSvData.level === 4) {
      heading = <h5 id={id}>{title}</h5>;
    } else {
      heading = <h6 id={id}>{title}</h6>;
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