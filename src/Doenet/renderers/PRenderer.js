import React from 'react';
import BaseRenderer from './BaseRenderer';

class PRenderer extends BaseRenderer{
  jsxCode(){
    super.jsxCode();
    return <p id={this._key}><a name={this._key} />{this.renderedChildren}</p>;
  }
}

let AvailableRenderers = {
  p: PRenderer,
}

export default AvailableRenderers;
