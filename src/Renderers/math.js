import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class MathRenderer extends DoenetRenderer {

  componentDidMount() {
    window.MathJax.Hub.Config({ showProcessingMessages: false, "fast-preview": { disabled: true } });
    window.MathJax.Hub.processSectionDelay = 0;
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this.componentName]);
  }

  componentDidUpdate() {
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this.componentName]);
  }

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    let mathJaxify = this.doenetSvData.latex;
    if (this.doenetSvData.renderMode === "inline") {
      mathJaxify = "\\(" + mathJaxify + "\\)";
    } else if (this.doenetSvData.renderMode === "display") {
      mathJaxify = "\\[" + mathJaxify + "\\]";
    } else if (this.doenetSvData.renderMode === "numbered") {
      mathJaxify = "\\begin{gather}" + mathJaxify + "\\end{gather}";
    } else if (this.doenetSvData.renderMode === "align") {
      mathJaxify = "\\begin{align*}" + mathJaxify + "\\end{align*}";
    } else if (this.doenetSvData.renderMode === "alignnumbered") {
      mathJaxify = "\\begin{align}" + mathJaxify + "\\end{align}";
    } else {
      // treat as inline if have unrecognized renderMode
      mathJaxify = "\\(" + mathJaxify + "\\)";
    }
    return <><a name={this.componentName} /><span id={this.componentName}>{mathJaxify}</span></>
  }
}