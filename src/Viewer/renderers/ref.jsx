import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Ref extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    let linkContent = this.children;
    if (this.children.length === 0) {
      linkContent = this.doenetSvData.linkText;
    }
    if (this.doenetSvData.contentId) {
      return <a target="_blank" id={this.componentName} name={this.componentName} href={`https://www.doenet.org/#/content/?contentId=${this.doenetSvData.contentId}`}>{linkContent}</a>
    } else if (this.doenetSvData.doenetId) {
      return <a target="_blank" id={this.componentName} name={this.componentName} href={`https://www.doenet.org/#/content/?doenetId=${this.doenetSvData.doenetId}`}>{linkContent}</a>
    } else if (this.doenetSvData.uri) {
      return <a target="_blank" id={this.componentName} name={this.componentName} href={this.doenetSvData.uri}>{linkContent}</a>
    } else {
      return <a id={this.componentName} name={this.componentName} href={"#" + this.doenetSvData.targetName}>{linkContent}</a>
    }

  }
}