import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';


export default React.memo(function TriggerSet(props) {
  let { name, SVs, actions, callAction } = useDoenetRender(props,false);

  if (SVs.hidden) {
    return null;
  }

  return (
    <div id={name} style={{ margin:"12px 0" ,display: "inline-block" }}>
      <a name={name} />
      <Button
        id={name + "_button"} 
        onClick={()=>callAction({ action:actions.triggerActions })} 
        disabled={SVs.disabled}
        value={SVs.label}
        valueHasLatex={SVs.labelHasLatex}
      />
    </div>
  )
})

