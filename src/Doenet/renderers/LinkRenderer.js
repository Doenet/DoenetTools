import React from 'react';
import BaseRenderer from './BaseRenderer';

class LinkRenderer extends BaseRenderer {
  constructor({ key, anchor, branchId, linktext }) {
    super({ key: key });
    this.anchor = anchor;
    this.linktext = linktext;
    this.branchId = branchId;
    this.setHref();
  }


  updateLink({ anchor, branchId, linktext }) {
    this.anchor = anchor;
    this.linktext = linktext;
    this.branchId = branchId;
    this.setHref();
  }

  setHref() {
    if(this.branchId) {
      this.href = `${this.branchId}`;
      if(this.anchor) {
        this.href += `#${this.anchor}`;
      }
    } else {
      this.href = `#${this.anchor}`;
    }
  }

  jsxCode() {
    return <a id={this._key} name={this._key} href={this.href}>{this.linktext}</a>
  }

}

let AvailableRenderers = {
  link: LinkRenderer,
}

export default AvailableRenderers;
