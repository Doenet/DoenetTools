import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Document extends DoenetRenderer{

  render(){
    if(this.children === undefined) {
      this.createChildren();
    }
    return <>{this.children}</>
  }
}