import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function Sq(props) {
  let { name, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return <><a name={name} />&lsquo;{children}&rsquo;</>

})
