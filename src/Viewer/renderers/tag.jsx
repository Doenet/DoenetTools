import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function Tag(props) {
  let { name, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  let open = "<";
  let close = ">";

  if(SVs.selfClosed) {
    close = "/>";
  }

  return <code id={name}><a name={name} />{open}{children}{close}</code>

})
