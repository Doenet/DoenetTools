import React from 'react';
import useDoenetRenderer from './useDoenetRenderer';

export default function P(props){
  let {name, SVs, children} = useDoenetRenderer(props);

  if (SVs.hidden) {
    return null;
  }

  return <p id={name}><a name={name} />{children}</p>
}
