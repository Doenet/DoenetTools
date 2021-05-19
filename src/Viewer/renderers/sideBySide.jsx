import React, { useRef, useState, useEffect } from 'react';

// import styled from "styled-components";
import useDoenetRender from './useDoenetRenderer';

export default function sideBySide(props) {
  let [name, SVs, _, children] = useDoenetRender(props);
  // console.log(">>>name: ", name, " value: ", SVs);
  // console.log(">>>children",children)

  if (SVs.hidden) {
    return null;
  }

  let styledChildren = [];
  const marginLeft = SVs.margins[0];
  const marginRight = SVs.margins[1];

  for (let [i, child] of children.entries()) {
    let width = SVs.widths[i];
    // console.log(">>>marginLeft",marginLeft)
    // console.log(">>>width",width)
    // console.log(">>>marginRight",marginRight)
    // console.log(">>>gap",SVs.gapWidth)
    styledChildren.push(
      <span
        style={{
          marginLeft: `${marginLeft}%`,
          marginRight: `${marginRight}%`,
          width: `${width}%`,
        }}
        key={child.key}
      >
        {child}
      </span>,
    );

    //Gap is only between not at the end
    if (children.length !== i + 1 && SVs.gapWidth > 0) {
      styledChildren.push(
        <span
          style={{ width: `${SVs.gapWidth}%` }}
          key={`gap${child.key}`}
        ></span>,
      );
    }
  }

  return (
    <div id={name} style={{ display: 'flex', maxWidth: '800px' }}>
      <a name={name} />
      {styledChildren}
    </div>
  );
}
