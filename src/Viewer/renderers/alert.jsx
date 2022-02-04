import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default function Alert(props){
  let {name, SVs, children} = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return <strong id={name} style={{color: '#C1292E'}}><a name={name} />{children}</strong>

}