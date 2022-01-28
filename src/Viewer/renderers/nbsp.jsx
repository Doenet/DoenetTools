import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default function Nbsp(props) {
  let { SVs } = useDoenetRender(props,false);

  if (SVs.hidden) {
    return null;
  }

  return <>&nbsp;</>

}
