import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';

export default function CallAction(props) {
  let {name, SVs, actions} = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return <span id={name}><a name={name} />
    <Button id={name + "_button"} onClick={actions.callAction} disabled={SVs.disabled} value={SVs.label} />
    </span>;
}
