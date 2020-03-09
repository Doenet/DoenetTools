import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class P extends DoenetRenderer{
 
  render(){
    return <p>{this.children}</p>
  }
}