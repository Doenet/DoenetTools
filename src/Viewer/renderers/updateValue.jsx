import React from 'react';
import useDoenetRender from '../useDoenetRenderer';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';


export default React.memo(function UpdateValue(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRender(props,false);

  if (SVs.hidden) {
    return null;
  }

  return (
    <div id={id} margin="12px 0" style={{display:"inline-block"}}>
      <a name={id} />
      <Button
        id={id + "_button"} 
        onClick={()=>callAction({ action:actions.updateValue })} 
        disabled={SVs.disabled}
        value={SVs.label}
        valueHasLatex={SVs.labelHasLatex}
      />
    </div>
  )
})
