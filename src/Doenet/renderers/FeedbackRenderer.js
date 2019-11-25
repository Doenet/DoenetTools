import React from 'react';
import BaseRenderer from './BaseRenderer';

class FeedbackRenderer extends BaseRenderer{
  jsxCode(){
    super.jsxCode();
    let infoBlockStyle = {margin:"4px 4px 4px 4px",padding:"6px",border:"1px solid #ebebeb",backgroundColor:"#fcfcfc"};
    return <aside id={this._key} style={infoBlockStyle}><a name={this._key}  />{this.renderedChildren}</aside>;
  }
}

let AvailableRenderers = {
  feedback: FeedbackRenderer,
}

export default AvailableRenderers;
