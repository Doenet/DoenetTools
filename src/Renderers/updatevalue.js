import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class UpdateValue extends DoenetRenderer {

  initializeChildrenOnConstruction = false;

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    return <span id={this.componentName}><a name={this.componentName} /><button id={this.componentName + "_button"} onClick={this.actions.updateValue}>{this.doenetSvData.label}</button></span>;

  }
}