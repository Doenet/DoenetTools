import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class PaginatorControls extends DoenetRenderer {

  static initializeChildrenOnConstruction = false;

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    return <p id={this.componentName}><a name={this.componentName} />
      <button id={this.componentName + "_previous"}
        onClick={() => this.actions.setPage({ number: this.doenetSvData.currentPage - 1 })}
        disabled={this.doenetSvData.disabled || !(this.doenetSvData.currentPage > 1)}
      >{this.doenetSvData.previousLabel}</button>
      {" " + this.doenetSvData.pageLabel} {this.doenetSvData.currentPage} of {this.doenetSvData.nPages + " "}
      <button id={this.componentName + "_next"}
        onClick={() => this.actions.setPage({ number: this.doenetSvData.currentPage + 1 })}
        disabled={this.doenetSvData.disabled || !(this.doenetSvData.currentPage < this.doenetSvData.nPages)}
      >{this.doenetSvData.nextLabel}</button>
    </p>;

  }
}