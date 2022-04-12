import React from 'react';
import useDoenetRenderer from './useDoenetRenderer';

export default function Pre(props){
  let {name, SVs, children} = useDoenetRenderer(props);

  if (SVs.hidden) {
    return null;
  }

  return <pre id={name}><a name={name} />{children}</pre>
}