import { MathJax } from 'better-react-mathjax';
import React, { useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function Number(props) {
  let { name, id, SVs } = useDoenetRender(props);


  if (SVs.hidden) {
    return null;
  }

  let number = SVs.text;
  if (SVs.renderAsMath) {
    number = "\\(" + number + "\\)"
  }
  return <><a name={id} /><span id={id}><MathJax hideUntilTypeset={"first"} inline dynamic >{number}</MathJax></span></>
})