import React from 'react';
import useDoenetRender from '../useDoenetRenderer';

export default React.memo(function Lsq(props) {
  let { SVs } = useDoenetRender(props, false);

  if (SVs.hidden) {
    return null;
  }

  return <>&lsquo;</>

})
