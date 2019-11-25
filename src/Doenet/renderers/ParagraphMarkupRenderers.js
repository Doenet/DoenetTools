import React from 'react';
import BaseRenderer from './BaseRenderer';

class EmRenderer extends BaseRenderer {
  jsxCode() {
    super.jsxCode();
    return <React.Fragment><a name={this._key} /><em id={this._key}>{this.renderedChildren}</em></React.Fragment>;
  }
}

class AlertRenderer extends BaseRenderer {
  jsxCode() {
    super.jsxCode();
    return <React.Fragment><a name={this._key} /><strong id={this._key}>{this.renderedChildren}</strong></React.Fragment>;
  }
}

class QRenderer extends BaseRenderer {
  jsxCode() {
    super.jsxCode();
    return <React.Fragment><a name={this._key} />&ldquo;{this.renderedChildren}&rdquo;</React.Fragment>;
  }
}


class SQRenderer extends BaseRenderer {
  jsxCode() {
    super.jsxCode();
    return <React.Fragment><a name={this._key} />&lsquo;{this.renderedChildren}&rsquo;</React.Fragment>;
  }
}

class CRenderer extends BaseRenderer {
  jsxCode() {
    super.jsxCode();
    return <React.Fragment><a name={this._key} /><code>{this.renderedChildren}</code></React.Fragment>;
  }
}


let AvailableRenderers = {
  em: EmRenderer,
  alert: AlertRenderer,
  q: QRenderer,
  sq: SQRenderer,
  c: CRenderer,
}

export default AvailableRenderers;
