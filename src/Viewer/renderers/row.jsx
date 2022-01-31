import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default function Row(props) {
  let { name, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  let style = {};

    if (SVs.valign !== null) {
      style.verticalAlign = SVs.valign;
    }
    if (SVs.left !== "none") {
      style.borderLeftStyle = "solid";
      if (SVs.left === "minor") {
        style.borderLeftWidth = "thin";
      } else if (SVs.left === "medium") {
        style.borderLeftWidth = "medium";
      } else {
        style.borderLeftWidth = "thick";
      }
    }
    return <tr id={name} style={style}>{children}</tr>


}


