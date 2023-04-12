import React from 'react';
import useDoenetRender from '../useDoenetRenderer';

export default React.memo(function Lq(props) {
  let { SVs } = useDoenetRender(props, false);

  if (SVs.hidden) {
    return null;
  }

  return <>&ldquo;</>

})
