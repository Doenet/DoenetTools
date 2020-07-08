import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Ref extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    let linkContent = this.children;
    if (this.children.length === 0) {
      linkContent = this.doenetSvData.linkText;
    }
    if (this.doenetSvData.uri) {
      return <a id={this.componentName} name={this.componentName} href={this.doenetSvData.uri}>{linkContent}</a>
    } else {
      return <a id={this.componentName} name={this.componentName} href={"#" + this.doenetSvData.targetName}>{linkContent}</a>
    }

  }
}