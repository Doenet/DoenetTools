import React from 'react';
import BaseRenderer from './BaseRenderer';

class DivRenderer extends BaseRenderer {
  constructor({ key, width }) {
    super({ key: key });
    this.width = width;
  }

  updateSection({ width }) {
    this.width = width;
  }

  jsxCode() {
    super.jsxCode();

    return <div id={this._key}>
      <a name={this._key} />
      {this.renderedChildren}
    </div>
  }

}

let AvailableRenderers = {
  div: DivRenderer,
}

export default AvailableRenderers;
