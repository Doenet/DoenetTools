import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';

export default React.memo(function CallAction(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return (
    <div id={id} style={{ margin: "12px 0", display: "inline-block" }}>
      <a name={id} />
      <Button
        id={id + "_button"}
        onClick={() => callAction({ action: actions.callAction })}
        disabled={SVs.disabled}
        value={SVs.label}
        valueHasLatex={SVs.labelHasLatex}
      />
    </div>
  )
})
