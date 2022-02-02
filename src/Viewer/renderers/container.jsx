import React from 'react';
import useDoenetRenderer from './useDoenetRenderer';

export default function Container(props){
  let {name, SVs, children} = useDoenetRenderer(props);

  if (SVs.hidden) {
    return null;
  }

  return <><a name={name} />{children}</>
}
