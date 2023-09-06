import React, { useRef, useState, useEffect } from "react";

// import styled from "styled-components";
import useDoenetRenderer from "../useDoenetRenderer";
import VisibilitySensor from "react-visibility-sensor-v2";

export default React.memo(function sideBySide(props) {
  let { name, id, SVs, children, actions, callAction } =
    useDoenetRenderer(props);
  // console.log(">>>name: ", name, " value: ", SVs);
  // console.log(">>>children",children)

  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible },
    });
  };

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false },
      });
    };
  }, []);

  if (SVs.hidden) {
    return null;
  }

  let styledChildren = [];
  const marginLeft = SVs.margins[0];
  const marginRight = SVs.margins[1];

  const numColumns = children.length;

  for (let [i, child] of children.entries()) {
    let width = SVs.widths[i];
    // console.log(">>>marginLeft",marginLeft)
    // console.log(">>>width",width)
    // console.log(">>>marginRight",marginRight)
    // console.log(">>>gap",SVs.gapWidth)

    let thisMarginLeft = marginLeft;
    let thisMarginRight = marginRight;

    if (i > 0) {
      thisMarginLeft += SVs.gapWidth / 2;
    }
    if (i < numColumns - 1) {
      thisMarginRight += SVs.gapWidth / 2;
    }

    styledChildren.push(
      <span
        style={{
          marginLeft: `${thisMarginLeft}%`,
          marginRight: `${thisMarginRight}%`,
          width: `${width}%`,
        }}
        key={child.key}
      >
        {child}
      </span>,
    );
  }

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div
        id={id}
        style={{ display: "flex", maxWidth: "850px", margin: "12px 0" }}
      >
        <a name={id} />
        {styledChildren}
      </div>
    </VisibilitySensor>
  );
});
