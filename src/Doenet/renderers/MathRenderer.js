import React from 'react';
import BaseRenderer from './BaseRenderer';

class MathRenderer extends BaseRenderer {
  constructor({ mathLatex, key, renderMode = "inline" }) {
    super({ key: key });
    this.mathLatex = mathLatex;
    this.renderMode = renderMode;

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  updateMathLatex(mathLatex) {
    this.mathLatex = mathLatex;
  }

  componentDidMount() {
    window.MathJax.Hub.Config({ showProcessingMessages: false, "fast-preview": { disabled: true } });
    window.MathJax.Hub.processSectionDelay = 0;
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this._key]);
  }

  componentDidUpdate() {
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this._key]);
  }

  jsxCode() {
    let mathJaxify = this.mathLatex;
    if (this.renderMode === "inline") {
      mathJaxify = "\\(" + this.mathLatex + "\\)";
    } else if (this.renderMode === "display") {
      mathJaxify = "\\[" + this.mathLatex + "\\]";
    } else if (this.renderMode === "numbered") {
      mathJaxify = "\\begin{gather}" + this.mathLatex + "\\end{gather}";
    } else if (this.renderMode === "align") {
      mathJaxify = "\\begin{align*}" + this.mathLatex + "\\end{align*}";
    } else if (this.renderMode === "alignnumbered") {
      mathJaxify = "\\begin{align}" + this.mathLatex + "\\end{align}";
    }
    return <React.Fragment><a name={this._key} /><span id={this._key}>{mathJaxify}</span></React.Fragment>;
  }

}

let AvailableRenderers = {
  math: MathRenderer,
}

export default AvailableRenderers;
