import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function C(props) {
  let {name, SVs, children} = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }
  
  return (
    <code id={name} style={{ margin:"12px 0" }}>
      <a name={name} />
      {children}
    </code>

  )
})


