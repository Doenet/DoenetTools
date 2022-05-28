import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';

export default React.memo(function Tabular(props) {
  let { name, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

const tableStyle = {
  width: sizeToCSS(SVs.width),
  height: sizeToCSS(SVs.height),
  borderCollapse: "collapse",
  borderColor: "black", 
  borderRadius: "var(--mainBorderRadius)"
}

let options = ["mean", "stdev", "n", "minimum", "quartile1", "median", "quartile3", "maximum", "sum"];

let columns = options.filter(x=>x in SVs.summaryStatistics);

let heading = <tr>{columns.map((x,i)=><th key={i}>{x}</th>)}</tr>
let data = <tr>{columns.map((x,i)=><td key={i}>{SVs.summaryStatistics[x]}</td>)}</tr>

return (
  <div style={{ margin: "12px 0" }} >
    <a name={name} />
    <p>Summary statistics of {SVs.columnName}</p>
    <table id={name} style={tableStyle}>
      <tbody>
        {heading}
        {data}
        </tbody>
    </table>
  </div>
  )
})

