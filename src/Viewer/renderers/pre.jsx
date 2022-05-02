import React from 'react';
import useDoenetRenderer from './useDoenetRenderer';

export default function Pre(props){
  let {name, SVs, children} = useDoenetRenderer(props);

  if (SVs.hidden) return null
  return (
    <pre id={name} style={{ margin: "12px 0"}}>
      <a name={name} />
      {children}
    </pre>
  )
}