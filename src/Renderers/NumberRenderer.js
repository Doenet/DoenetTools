import React from 'react';
import DoenetRenderer from './DoenetRenderer';


export default class NumberRenderer extends DoenetRenderer{

  
  render(){
    let value = Number(this.doenetSvData.value)+1;
    
    return <div width="100px" height="100px" 
    onClick={()=>this.props.requestUpdate({value})}>
      {this.doenetSvData.value}</div>
  }
}