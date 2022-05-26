import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default function Tag(props) {
  let { name, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  let open = "<";
  let close = ">";

  if(SVs.selfClosed) {
    close = "/>";
  }

  return <code id={name} style={{color:'var(--mainGreen)'}}><a name={name} />{open}{children}{close}</code>

}
