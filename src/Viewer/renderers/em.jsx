import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function Em(props) {
  let {name, SVs, children} = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }
  
  return <em id={name}><a name={name} />{children}</em>
})