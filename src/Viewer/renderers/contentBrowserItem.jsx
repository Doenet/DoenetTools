import React, { useEffect } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import VisibilitySensor from "react-visibility-sensor-v2";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { cesc } from "../../_utils/url";

export default React.memo(function ContentBrowser(props) {
  let { name, id, SVs, children, actions, callAction } =
    useDoenetRenderer(props);

  let { search } = useLocation();

  let onChangeVisibility = (isVisible) => {
    if (actions.recordVisibilityChange) {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible },
      });
    }
  };

  useEffect(() => {
    return () => {
      if (actions.recordVisibilityChange) {
        callAction({
          action: actions.recordVisibilityChange,
          args: { isVisible: false },
        });
      }
    };
  }, []);

  if (SVs.hidden) {
    return null;
  }

  let title = null;
  if (SVs.titleChildIndex !== null) {
    title = <h3>{children[SVs.titleChildIndex]}</h3>;
    children = [
      ...children.slice(0, SVs.titleChildIndex),
      ...children.slice(SVs.titleChildIndex + 1),
    ];
  }

  let firstSlash = id.indexOf("\\/");
  let prefix = id.substring(0, firstSlash);
  let urlStart = search + "#" + prefix;

  let labels = SVs.itemInfoForInitial.map((itemInfo) => (
    <Link
      key={itemInfo.ind}
      style={{
        padding: "4px",
        width: "100%",
        cursor: "pointer",
        color: "var(--canvasText)",
        textDecoration: "none",
        backgroundColor: itemInfo.selected
          ? "var(--mainGray)"
          : "var(--canvas)",
      }}
      to={urlStart + cesc(itemInfo.componentName)}
    >
      {itemInfo.label}
    </Link>
  ));

  let labelPicker = (
    <div style={{ width: "25%" }} data-test="labelPicker">
      <div
        style={{
          marginTop: "12px",
          height: "25px",
          maxWidth: "220px",
        }}
      >
        Select component
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "solid",
          aspectRatio: "0.5",
          maxWidth: "100%",
          minHeight: "200px",
          overflowX: "hidden",
          marginBottom: "12px",
          boxSizing: "border-box",
        }}
      >
        {labels}
      </div>
    </div>
  );

  let titleAndFirstChild = (
    <div
      style={{
        width: "70%",
        display: "flex",
        flexDirection: "column",
        marginTop: "12px",
        marginLeft: "5%",
      }}
      data-test="titleAndFirstChild"
    >
      <div>{title}</div>
      <div>{children[0]}</div>
    </div>
  );

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div id={id}>
        <a name={id} />
        <div style={{ display: "flex" }}>
          {labelPicker}
          {titleAndFirstChild}
        </div>
        {children.slice(1)}
      </div>
    </VisibilitySensor>
  );
});
