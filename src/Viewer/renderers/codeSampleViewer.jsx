import React, { useRef, useState } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import VisibilitySensor from "react-visibility-sensor-v2";
import { useEffect } from "react";
import { rendererState } from "../useDoenetRenderer";
import { useSetRecoilState } from "recoil";
import { sizeToCSS } from "./utils/css";
import CodeMirror from "../../Tools/_framework/CodeMirror";

export default React.memo(function ContentPicker(props) {
  let { name, id, SVs, children, actions, callAction } =
    useDoenetRenderer(props);

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

  let viewer = children[0];
  let editor = children[1];
  let title = null;
  if (SVs.titleChildInd !== null) {
    title = children[SVs.titleChildInd];
    children.splice(SVs.titleChildInd, 1); // remove title
  }
  let otherChildren = children.slice(2);

  if (title) {
    title = (
      <>
        {SVs.titlePrefix}
        {title}
      </>
    );
  } else if (!SVs.inAList) {
    title = SVs.title;
  }

  let heading = null;
  let headingId = id + "_title";

  switch (SVs.level) {
    case 0:
      heading = <h1 id={headingId}>{title}</h1>;
      break;
    case 1:
      heading = <h2 id={headingId}>{title}</h2>;
      break;
    case 2:
      heading = <h3 id={headingId}>{title}</h3>;
      break;
    case 3:
      heading = <h4 id={headingId}>{title}</h4>;
      break;
    case 4:
      heading = <h5 id={headingId}>{title}</h5>;
      break;
    default:
      heading = <h6 id={headingId}>{title}</h6>;
      break;
  }

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <section id={id}>
        <a name={id} />
        {heading}
        <div style={{ display: "flex", maxWidth: "100%", margin: "12px 0" }}>
          <div
            style={{
              maxWidth: "50%",
              paddingRight: "15px",
              boxSizing: "border-box",
            }}
          >
            {viewer}
          </div>
          <div
            style={{
              maxWidth: "50%",
              boxSizing: "border-box",
            }}
          >
            {editor}
          </div>
        </div>
        {otherChildren}
      </section>
    </VisibilitySensor>
  );
});
