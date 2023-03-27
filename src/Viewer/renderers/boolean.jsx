import React from 'react';
import useDoenetRender from '../useDoenetRenderer';

export default React.memo(function Boolean(props) {
  let { name, id, SVs } = useDoenetRender(props, false);

  if (SVs.hidden) {
    return null;
  }

  return <><a name={id} /><span id={id}>{SVs.text}</span></>
})


