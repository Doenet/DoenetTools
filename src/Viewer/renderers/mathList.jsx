import { MathJax } from 'better-react-mathjax';
import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function MathList(props) {
  let { name, id, SVs, children } = useDoenetRender(props);


  if (SVs.hidden) {
    return null;
  }

  if (children.length === 0 && SVs.latex) {
    return <React.Fragment key={id}><a name={id} /><span id={id}><MathJax hideUntilTypeset={"first"} inline dynamic >{"\\(" + SVs.latex + "\\)"}</MathJax></span></React.Fragment>;
  }

  if (children.length === 0) {
    return <React.Fragment key={id} />
  }

  let withCommas = children.slice(1).reduce((a, b) => [...a, ', ', b], [children[0]])

  return <React.Fragment key={id} ><a name={id} /><span id={id}>{withCommas}</span></React.Fragment>;
})

