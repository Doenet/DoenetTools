import React from 'react';
import useDoenetRender from '../useDoenetRenderer';

export default React.memo(function Rsq(props) {
  let { SVs } = useDoenetRender(props, false);

  if (SVs.hidden) {
    return null;
  }

  return <>&rsquo;</>

})
