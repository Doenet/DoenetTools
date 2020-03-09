import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Document extends DoenetRenderer{

  render(){
    return <>{this.children}</>
  }
}