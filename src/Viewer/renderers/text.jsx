import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function Text(props) {
  let { name, id, SVs, actions, sourceOfUpdate } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }
  return <><a name={id} /><span id={id}>{SVs.text}</span></>
})