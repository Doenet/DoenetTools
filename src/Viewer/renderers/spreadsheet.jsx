import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { HotTable } from '@handsontable/react';
import { HyperFormula } from 'hyperformula';
import 'handsontable/dist/handsontable.full.css';
import { sizeToCSS } from './utils/css';
import { registerAllModules } from 'handsontable/registry';

registerAllModules();


export default function SpreadsheetRenderer(props) {
  let { name, SVs, actions, callAction } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }
  
  return (
    <div id={name} style={{ margin: "12px 0" }} >
      <a name={name} />
      <HotTable
        // style={{ borderRadius:"var(--mainBorderRadius)", border:"var(--mainBorder)" }}
        licenseKey='non-commercial-and-evaluation'
        data={SVs.cells.map(x => [...x])}
        colHeaders={SVs.columnHeaders}
        rowHeaders={SVs.rowHeaders}
        width={sizeToCSS(SVs.width)}
        height={sizeToCSS(SVs.height)}
        // beforeChange={this.actions.onChange} 
        afterChange={(changes, source) => callAction({action:actions.onChange, args:{ changes, source }})}
        formulas={{
          engine: HyperFormula
        }}
        fixedRowsTop={SVs.fixedRowsTop}
        fixedColumnsLeft={SVs.fixedColumnsLeft}
        hiddenColumns={{
          columns: SVs.hiddenColumns.map(x => x - 1),
          indicators: false
        }}
        hiddenRows={{
          rows: SVs.hiddenRows.map(x => x - 1),
          indicators: false
        }}
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
      />
    </div>
  )
}

