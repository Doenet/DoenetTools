import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';

export default function Tabular(props) {
  let { name, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

const tableStyle = {
  width: sizeToCSS(SVs.width),
  height: sizeToCSS(SVs.height),
  borderCollapse: "collapse",
  borderColor: "black", 
  borderRadius: "5px"
}
if (SVs.top !== "none") {
  tableStyle.borderTopStyle = "solid";
  if (SVs.top === "minor") {
    tableStyle.borderTopWidth = "thin";
  } else if (SVs.top === "medium") {
    tableStyle.borderTopWidth = "medium";
  } else {
    tableStyle.borderTopWidth = "thick";
  }
}

return (
  <div style={{ margin: "12px 0" }} >
    <a name={name} />
    <table id={name} style={tableStyle}>
      <tbody>{children}</tbody>
    </table>
  </div>
  )
}

