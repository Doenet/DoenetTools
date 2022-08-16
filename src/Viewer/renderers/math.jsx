import React, { useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { MathJax } from "better-react-mathjax";

export default React.memo(function Math(props) {
  let { name, id, SVs, actions, sourceOfUpdate } = useDoenetRender(props);


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


  // Note: when a component type gets switched, sometimes state variables change before renderer
  // so protect against case where the latexWithInputChildren is gone but renderer is still math
  if(!SVs.latexWithInputChildren) {
    return null;
  }

  let latexOrInputChildren = SVs.latexWithInputChildren.map(
    x => typeof x === "number" ? this.children[x] : beginDelim + x + endDelim
  )

  let anchors = [
    React.createElement('a', { name: id, key: id })
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
    return <>{anchors}<span id={id}></span></>

  } else if (latexOrInputChildren.length === 1) {
    return <>{anchors}<span id={id}><MathJax hideUntilTypeset={"first"} inline dynamic >{latexOrInputChildren[0]}</MathJax></span></>

  } else if (latexOrInputChildren.length === 2) {
    return <>{anchors}<span id={id}><MathJax hideUntilTypeset={"first"} inline dynamic >{latexOrInputChildren[0]}{latexOrInputChildren[1]}</MathJax></span></>
  } else {
    return <>{anchors}<span id={id}><MathJax hideUntilTypeset={"first"} inline dynamic >{latexOrInputChildren[0]}</MathJax></span></>
  }
})