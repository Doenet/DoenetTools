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

    let url = "";
    let target = "_blank";
    if (this.doenetSvData.contentId) {
      url = `https://www.doenet.org/#/content/?contentId=${this.doenetSvData.contentId}`;
    } else if (this.doenetSvData.doenetId) {
      url = `https://www.doenet.org/#/content/?doenetId=${this.doenetSvData.doenetId}`;
    } else if (this.doenetSvData.uri) {
      url = this.doenetSvData.uri;
    } else {
      url = "#" + this.doenetSvData.targetName;
      target = null;
    }


    if (this.doenetSvData.createButton) {
      return <span id={this.componentName}><a name={this.componentName} />
        <button id={this.componentName + "_button"} onClick={() => window.location.href=url} disabled={this.doenetSvData.disabled}>{this.doenetSvData.linkText}</button>
      </span>;

    } else {
      return <a target={target} id={this.componentName} name={this.componentName} href={url}>{linkContent}</a>
    }
  }
}