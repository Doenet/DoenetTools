// import React from 'react';
// import BaseRenderer from './BaseRenderer';
// import ReactTable from 'react-table';
// import reacttablestyle from 'react-table/react-table.css';

// class TableRenderer extends BaseRenderer {
//   constructor({ key, cells, width, height }) {
//     super({ key: key });
//     // this.actions = actions;
//     // this.cells = cells;
//     // this.width = width;
//     // this.height = height;

//     this.updateTable({ cells: cells, width: width, height: height });

//   }

//   updateTable({ cells, width, height }) {
//     this.width = width;
//     this.height = height;
//     this.cells = cells;

//     this.data = [];
//     this.headings = [];
//     this.columns = [];
//     this.pageSize = this.cells.length;

//     // if(headings === undefined){
//     for (let [i, cell] of this.cells[0].entries()) {
//       this.headings.push(numberToLetters(i));
//     }
//     // }

//     for (let heading of this.headings) {
//       this.columns.push({
//         Header: heading,
//         accessor: heading
//       });
//     }

//     for (let row of this.cells) {
//       var rowData = {};
//       for (let [c, cell] of row.entries()) {
//         let heading = this.headings[c];
//         rowData[heading] = cell;
//       }
//       this.data.push(rowData);
//     }

//   }


//   jsxCode() {

//     return <div style={{ width: this.width, height: this.height }}>
//       <a name={this._key} />
//       <ReactTable
//         style={reacttablestyle}
//         data={this.data}
//         showPagination={false}
//         showPageJump={false}
//         // defaultPageSize={5}
//         pageSize={this.pageSize}
//         // resolveData={data => data.map(row => row)}
//         columns={this.columns}
//       />
//     </div>

//   }

// }
// function numberToLetters(number) {
//   let letters = "";
//   while (true) {
//     let nextNum = number % 26;
//     letters = String.fromCharCode(65 + nextNum) + letters;
//     if (number < 26) {
//       break;
//     }
//     number = Math.floor(number / 26) - 1;
//   }
//   return letters;
// }

// let AvailableRenderers = {
//   table: TableRenderer,
// }

// export default AvailableRenderers;
