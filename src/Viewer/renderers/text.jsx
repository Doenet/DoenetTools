import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default function Text(props) {
  let { name, SVs, actions, sourceOfUpdate } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }
  return <><a name={name} /><span id={name}>{SVs.text}</span></>
}