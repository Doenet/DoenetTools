import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function Boolean(props) {
  let {name, SVs} = useDoenetRender(props,false);

  if (SVs.hidden) {
    return null;
  }

  return <><a name={name} /><span id={name}>{SVs.text}</span></>
})


