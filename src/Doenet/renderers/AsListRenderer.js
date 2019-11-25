import React from 'react';
import BaseRenderer from './BaseRenderer';

class AsListRenderer extends BaseRenderer {


  jsxCode(){
    super.jsxCode();

    if(this.renderedChildren.length === 0) {
      return <React.Fragment key={this._key}/>
    }

    let withCommas = this.renderedChildren.slice(1).reduce((a,b) => [...a, ', ', b], [this.renderedChildren[0]])
    
    return <React.Fragment key={this._key}><a name={this._key} />{withCommas}</React.Fragment>;
  }

}

let AvailableRenderers = {
  aslist: AsListRenderer,
}

export default AvailableRenderers;
