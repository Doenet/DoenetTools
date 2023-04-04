import React from 'react';
import useDoenetRender from '../useDoenetRenderer';

export default React.memo(function ContainerInline(props) {
  let { name, id, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return <span id={id}><a name={id} />{children}</span>;
})
