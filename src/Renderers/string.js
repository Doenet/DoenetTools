import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class StringRenderer extends DoenetRenderer{
 
  render(){
    return <>{this.doenetSvData.value}</>
  }
}