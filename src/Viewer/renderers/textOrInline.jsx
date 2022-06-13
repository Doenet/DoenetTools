import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function TextOrInline(props) {
  let { name, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return <span id={name}><a name={name} />{children}</span>;
})
