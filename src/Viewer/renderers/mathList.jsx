import React, { useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';

export default function MathList(props) {
  let { name, SVs, children } = useDoenetRender(props);

  useEffect(()=>{
    if (window.MathJax) {
      window.MathJax.Hub.Config({ showProcessingMessages: false, "fast-preview": { disabled: true } });
      window.MathJax.Hub.processSectionDelay = 0;
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
    }
  },[]);

  if (window.MathJax) {
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
  }

  if (SVs.hidden) {
    return null;
  }

  if (children.length === 0 && SVs.latex) {
    return <React.Fragment key={name}><a name={name} /><span id={name}>{"\\(" + SVs.latex + "\\)"}</span></React.Fragment>;
  }

  if (children.length === 0) {
    return <React.Fragment key={name} />
  }

  let withCommas = children.slice(1).reduce((a, b) => [...a, ', ', b], [children[0]])

  return <React.Fragment key={name}><a name={name} />{withCommas}</React.Fragment>;
}

