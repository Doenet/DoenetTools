import React, { useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';

export default function Math(props) {
  let { name, SVs, actions, sourceOfUpdate } = useDoenetRender(props);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.Hub.Config({ showProcessingMessages: false, "fast-preview": { disabled: true } });
      window.MathJax.Hub.processSectionDelay = 0;
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
    }
  })


  if (SVs.hidden) {
    return null;
  }


  let beginDelim, endDelim;
  if (SVs.renderMode === "inline") {
    beginDelim = "\\(";
    endDelim = "\\)";
  } else if (SVs.renderMode === "display") {
    beginDelim = "\\[";
    endDelim = "\\]";
  } else if (SVs.renderMode === "numbered") {
    beginDelim = `\\begin{gather}\\tag{${SVs.equationTag}}`;
    endDelim = "\\end{gather}";
  } else if (SVs.renderMode === "align") {
    beginDelim = "\\begin{align}";
    endDelim = "\\end{align}";
  } else {
    // treat as inline if have unrecognized renderMode
    beginDelim = "\\(";
    endDelim = "\\)";
  }

  // if element of latexOrInputChildren is a number,
  // then that element is an index of which child (a mathInput) to render
  // else, that element is a latex string

  // TODO: we don't want deliminers around each piece,
  // instead, we want to be able to put the mathInput inside mathjax
  // This is just a stopgap solution that works in a few simple cases!!!

  let latexOrInputChildren = SVs.latexWithInputChildren.map(
    x => typeof x === "number" ? this.children[x] : beginDelim + x + endDelim
  )

  let anchors = [
    React.createElement('a', { name, key: name })
  ];
  if (SVs.mrowChildNames) {
    anchors.push(SVs.mrowChildNames.map(x =>
      React.createElement('a', { name: x, key: x })
    ))
  }

  // TODO: BADBADBAD
  // Don't understand why MathJax isn't updating when using {latexOrInputChildren}
  // so hard coded the only two cases using so far: with 1 or 2 entries

  if (latexOrInputChildren.length === 0) {
    return <>{anchors}<span id={name}></span></>

  } else if (latexOrInputChildren.length === 1) {
    return <>{anchors}<span id={name}>{latexOrInputChildren[0]}</span></>

  } else if (latexOrInputChildren.length === 2) {
    return <>{anchors}<span id={name}>{latexOrInputChildren[0]}{latexOrInputChildren[1]}</span></>
  } else {
    return <>{anchors}<span id={name}>{latexOrInputChildren[0]}</span></>
  }
}