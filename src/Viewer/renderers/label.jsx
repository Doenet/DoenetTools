import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { MathJax } from "better-react-mathjax";

export default React.memo(function Label(props) {
  let { name, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  if(children.length > 0) {
    return <span id={name}><a name={name} />{children}</span>;
  } else {
    let label = SVs.value;

    if(SVs.hasLatex) {
      label =  <MathJax hideUntilTypeset={"first"} inline dynamic >{label}</MathJax>
    } 
    return <span id={name}><a name={name} />{label}</span>;

  }


})
