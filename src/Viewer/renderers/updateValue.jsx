import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';


export default function UpdateValue(props) {
  let { name, SVs, actions, callAction } = useDoenetRender(props,false);

  if (SVs.hidden) {
    return null;
  }

  return (
    <div id={name} margin="12px 0">
      <a name={name} />
      <Button
        id={name + "_button"} 
        onClick={()=>callAction({ action:actions.updateValue })} 
        disabled={SVs.disabled}
        value={SVs.label}
      />
      {/* <button 
      id={name + "_button"} 
      onClick={()=>callAction({ action:actions.updateValue })} 
      disabled={SVs.disabled}
      >{SVs.label}
      </button> */}
    </div>
  )
}
