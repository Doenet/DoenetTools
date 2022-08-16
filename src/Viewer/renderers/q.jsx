import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function Q(props) {
  let { name, id, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return <><a name={id} />&ldquo;{children}&rdquo;</>

})

