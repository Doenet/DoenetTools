import React from 'react';
import BaseRenderer from './BaseRenderer';

class UpdateValueRenderer extends BaseRenderer {
  constructor({ actions, key, label }) {
    super({ key: key })
    this.actions = actions;
    // this.width = width;
    // this.height = height;
    this.label = label;

  }

  jsxCode() {
    return <span id={this._key}><a name={this._key} /><button id={this._key + "_button"} onClick={this.actions.updateValue}>{this.label}</button></span>;
  }

}

let AvailableRenderers = {
  updatevalue: UpdateValueRenderer,
}

export default AvailableRenderers;
