import React from 'react';
import BaseRenderer from './BaseRenderer';
import { HotTable } from '@handsontable/react';
import "./handsontable.full.css";


class SpreadsheetRenderer extends BaseRenderer {
  constructor({ key, actions, cells, width, height }) {
    super({ key: key })
    this.actions = actions;
    this.cells = cells;
    this.width = width;
    this.height = height;
  }

  updateSpreadsheet({ cells, width, height }) {
    this.width = width;
    this.height = height;
    this.cells = cells;
  }


  jsxCode() {
    return <div id={this._key}>
      <a name={this._key} />
      <HotTable
        data={this.cells}
        colHeaders={true}
        rowHeaders={true}
        width={this.width}
        height={this.height}
        // beforeChange={this.actions.onChange} 
        afterChange={this.actions.onChange}
        // fixedRowsTop={1}
        // fixedColumnsLeft={1}
        // contextMenu={
        //   {
        //     items: {
        //       'row_above': {
        //         // name: 'Insert row above this one'
        //       },
        //       'row_below':{
        //         // name: 'Insert row below this one'
        //       },
        //     }
        //   }
        // }
        stretchH="all"
      /></div>
  }

}

let AvailableRenderers = {
  spreadsheet: SpreadsheetRenderer,
}

export default AvailableRenderers;
