import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';


export default function UpdateValue(props) {
  let { name, SVs, actions, callAction } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return <span id={name}><a name={name} />
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
    </span>;
}
