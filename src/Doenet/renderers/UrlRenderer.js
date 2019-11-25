import React from 'react';
import BaseRenderer from './BaseRenderer';

class UrlRenderer extends BaseRenderer {
  constructor({ key, href, linktext }) {
    super({ key: key });
    this.href = href;
    this.linktext = linktext;
  }

  updateURL({ href, linktext }) {
    this.href = href;
    this.linktext = linktext;
  }

  jsxCode() {
    return <a id={this._key} name={this._key} href={this.href}>{this.linktext}</a>
  }

}

let AvailableRenderers = {
  url: UrlRenderer,
}

export default AvailableRenderers;
