import React from 'react';
import BaseRenderer from './BaseRenderer';

class ListRenderer extends BaseRenderer {
  constructor({ key, numbered, label, item = false }) {
    super({ key: key });
    this.numbered = numbered;
    this.label = label;
    this.item = item;
  }

  jsxCode() {
    super.jsxCode();


    // TODO: incorporate label
    if (this.item) {
      return <li id={this._key}><a name={this._key} />{this.renderedChildren}</li>;
    } else if (this.numbered) {
      return <ol id={this._key}><a name={this._key} />{this.renderedChildren}</ol>;
    } else {
      return <ul id={this._key}><a name={this._key} />{this.renderedChildren}</ul>;
    }
  }

}

let AvailableRenderers = {
  list: ListRenderer,
}

export default AvailableRenderers;
