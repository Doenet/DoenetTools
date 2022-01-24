import React, { useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';

export default function Number(props) {
  let { name, SVs, actions, sourceOfUpdate } = useDoenetRender(props);

  useEffect(() => {
    if (window.MathJax && SVs.renderAsMath) {
      window.MathJax.Hub.Config({ showProcessingMessages: false, "fast-preview": { disabled: true } });
      window.MathJax.Hub.processSectionDelay = 0;
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
    }
  })


  if (SVs.hidden) {
    return null;
  }

  let number = SVs.valueForDisplay;
  if (SVs.renderAsMath) {
    number = "\\(" + number + "\\)"
  }
  return <><a name={name} /><span id={name}>{number}</span></>
}