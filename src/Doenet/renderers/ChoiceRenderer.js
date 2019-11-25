import React from 'react';
import BaseRenderer from './BaseRenderer';

class ChoiceRenderer extends BaseRenderer {

  jsxCode(){
    super.jsxCode();
    
    let keyForChoice = this.keyFromInput;
    if(keyForChoice === undefined) {
      keyForChoice = this._key;
    }
 
    return <span id={keyForChoice}><a name={this._key} />{this.renderedChildren}</span>;
  }

}

let AvailableRenderers = {
  choice: ChoiceRenderer,
}

export default AvailableRenderers;
