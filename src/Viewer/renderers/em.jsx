import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function Em(props) {
  let {name, id, SVs, children} = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }
  
  return <em id={id}><a name={id} />{children}</em>
})