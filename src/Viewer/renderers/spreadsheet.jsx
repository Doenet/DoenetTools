import React from 'react';
import DoenetRenderer from './DoenetRenderer';
import { HotTable } from '@handsontable/react';
import { HyperFormula } from 'hyperformula';
import 'handsontable/dist/handsontable.full.css';
import { sizeToCSS } from './utils/css';


export default class SpreadsheetRenderer extends DoenetRenderer {
  constructor(props) {
    super(props);

    // this.hf = HyperFormula.buildEmpty({ licenseKey: "agpl-v3" });
  }

  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }


    return <div id={this.componentName}>
      <a name={this.componentName} />
      <HotTable
        licenseKey='non-commercial-and-evaluation'
        data={this.doenetSvData.cells.map(x => [...x])}
        colHeaders={true}
        rowHeaders={true}
        width={sizeToCSS(this.doenetSvData.width)}
        height={sizeToCSS(this.doenetSvData.height)}
        // beforeChange={this.actions.onChange} 
        afterChange={this.actions.onChange.bind(this)}
        formulas={{
          engine: HyperFormula
        }}
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