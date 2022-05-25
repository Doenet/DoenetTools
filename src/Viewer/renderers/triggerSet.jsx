import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';


export default React.memo(function TriggerSet(props) {
  let { name, SVs, actions, callAction } = useDoenetRender(props,false);

  if (SVs.hidden) {
    return null;
  }

  return (
    <div id={name} style={{ margin:"12px 0" }}>
      <a name={name} />
      <Button
        id={name + "_button"} 
        onClick={()=>callAction({ action:actions.triggerActions })} 
        disabled={SVs.disabled}
        value={SVs.label}
      />
      {/* <button 
      id={name + "_button"} 
      onClick={()=>callAction({ action:actions.triggerActions })} 
      disabled={SVs.disabled}
      >{SVs.label}
      </button> */}
    </div>
  )
})



// import React from 'react';
// import DoenetRenderer from './DoenetRenderer';

// export default class TriggerSet extends DoenetRenderer {

//   static initializeChildrenOnConstruction = false;

//   render() {

//     if (this.doenetSvData.hidden) {
//       return null;
//     }

//     return <span id={this.componentName}><a name={this.componentName} />
//     <button id={this.componentName + "_button"} onClick={this.actions.triggerActions} disabled={this.doenetSvData.disabled}>{this.doenetSvData.label}</button>
//     </span>;

//   }
// }