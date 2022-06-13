import { MathJax } from 'better-react-mathjax';
import React, { useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function MathList(props) {
  let { name, SVs, children } = useDoenetRender(props);


  if (SVs.hidden) {
    return null;
  }

  if (children.length === 0 && SVs.latex) {
    return <React.Fragment key={name}><a name={name} /><span id={name}><MathJax hideUntilTypeset={"first"} inline dynamic >{"\\(" + SVs.latex + "\\)"}</MathJax></span></React.Fragment>;
  }

  if (children.length === 0) {
    return <React.Fragment key={name} />
  }

  let withCommas = children.slice(1).reduce((a, b) => [...a, ', ', b], [children[0]])

  return <React.Fragment key={name} ><a name={name} />{withCommas}</React.Fragment>;
})

