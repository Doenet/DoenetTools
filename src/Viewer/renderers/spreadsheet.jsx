import React from 'react';
import DoenetRenderer from './DoenetRenderer';
import { HotTable } from '@handsontable/react';
import { HyperFormula } from 'hyperformula';
import 'handsontable/dist/handsontable.full.css';
import { sizeToCSS } from './utils/css';


export default class SpreadsheetRenderer extends DoenetRenderer {

  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }


    return <div id={this.componentName}>
      <a name={this.componentName} />
      <HotTable
        licenseKey='non-commercial-and-evaluation'
        data={this.doenetSvData.cells.map(x => [...x])}
        colHeaders={this.doenetSvData.columnHeaders}
        rowHeaders={this.doenetSvData.rowHeaders}
        width={sizeToCSS(this.doenetSvData.width)}
        height={sizeToCSS(this.doenetSvData.height)}
        // beforeChange={this.actions.onChange} 
        afterChange={this.actions.onChange.bind(this)}
        formulas={{
          engine: HyperFormula
        }}
        fixedRowsTop={this.doenetSvData.fixedRowsTop}
        fixedColumnsLeft={this.doenetSvData.fixedColumnsLeft}
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