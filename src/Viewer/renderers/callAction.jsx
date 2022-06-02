import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';

export default React.memo(function CallAction(props) {
  let { name, SVs, actions, callAction } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return (
    <div style={{ margin: "12px 0" }}>
      <a name={name} />
      <Button id={name + "_button"} onClick={() => callAction({ action: actions.callAction })} disabled={SVs.disabled} value={SVs.label} />
    </div>
  )
})
