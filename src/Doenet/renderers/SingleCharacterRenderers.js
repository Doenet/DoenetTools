import React from 'react';
import BaseRenderer from './BaseRenderer';

class Ndash extends BaseRenderer {
  jsxCode() {
    return <React.Fragment key={this._key}><a name={this._key} />&ndash;</React.Fragment>;
  }
}

class Mdash extends BaseRenderer {
  jsxCode() {
    return <React.Fragment key={this._key}><a name={this._key} />&mdash;</React.Fragment>;
  }
}

class NBSP extends BaseRenderer {
  jsxCode() {
    return <React.Fragment key={this._key}><a name={this._key} />&nbsp;</React.Fragment>;
  }
}


let AvailableRenderers = {
  ndash: Ndash,
  mdash: Mdash,
  nbsp: NBSP,
}

export default AvailableRenderers;
