import React, { useEffect, useState, useRef, createContext } from 'react';
import { sizeToCSS } from './utils/css';
import useDoenetRender from './useDoenetRenderer';
import Plotly from 'plotly.js-dist-min';
import VisibilitySensor from 'react-visibility-sensor-v2';


export const BoardContext = createContext();

export default React.memo(function Chart(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRender(props);
  // console.log({ name, SVs })

  let onChangeVisibility = isVisible => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible }
    })
  }

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false }
      })
    }
  }, [])

  //Draw chart after mounting component
  // useEffect(() => {

  //   if (SVs.dataFrame !== null) {

  //     let colInds;
  //     if (SVs.colInd !== null) {
  //       colInds = [SVs.colInd]
  //     } else {
  //       colInds = SVs.dataFrame.columnTypes
  //         .map((v, i) => v === "number" ? i : null)
  //         .filter(x => x !== null);
  //     }


  //     let data = [];

  //     for (let colInd of colInds) {
  //       if (SVs.type === "box") {
  //         data.push({
  //           y: extractColumn(SVs.dataFrame.data, colInd),
  //           type: "box",
  //           name: SVs.dataFrame.columnNames[colInd]
  //         })
  //       } else {
  //         data.push({
  //           x: extractColumn(SVs.dataFrame.data, colInd),
  //           type: "histogram",
  //           name: SVs.dataFrame.columnNames[colInd]
  //         })
  //       }
  //     }

  //     Plotly.newPlot(name, {
  //       data
  //     });
  //   }

  // }, []);


  return <>
    <a name={id} />
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><div id={id} /></VisibilitySensor>
  </>;

})


function extractColumn(data, colInd) {
  let dataColumn = [];
  for (let row of data) {
    if (row[colInd] !== null) {
      dataColumn.push(row[colInd]);
    }
  }
  return dataColumn;
}