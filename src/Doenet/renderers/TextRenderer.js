import React from 'react';
import BaseRenderer from './BaseRenderer';

class TextRenderer extends BaseRenderer {
  constructor({ key, text, suppressKeyRender = false }) {
    super({ key: key });
    this.text = text;
    this.suppressKeyRender = suppressKeyRender;
  }

  updateText(text) {
    this.text = text;
  }

  jsxCode() {
    if (this.suppressKeyRender) {
      return <React.Fragment>{this.text}</React.Fragment>
    } else {
      return <span id={this._key}><a name={this._key}/>{this.text}</span>;
    }
  }

}

let AvailableRenderers = {
  text: TextRenderer,
}

export default AvailableRenderers;
