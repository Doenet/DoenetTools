import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default function C(props) {
  let {name, SVs, children} = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }
  
  return <code id={name}><a name={name} />{children}</code>;
}


