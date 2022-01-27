import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default function Nbsp(props) {
  let { name, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return <>&nbsp;</>

}
