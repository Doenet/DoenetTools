import React, { useEffect } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import VisibilitySensor from "react-visibility-sensor-v2";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { cesc } from "../../_utils/url";

export default React.memo(function ExampleBrowser(props) {
  let { name, id, SVs, children, actions, callAction } =
    useDoenetRenderer(props);

  let { hash, search } = useLocation();

  let onChangeVisibility = (isVisible) => {
    if (actions.recordVisibilityChange) {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible },
      });
    }
  };

  let setSelectedItemInd = (ind) => {
    callAction({
      action: actions.setSelectedItemInd,
      args: { ind },
    });
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

  useEffect(() => {
    // Check to see if hash contains the component name of one of the items of the browser.
    // If so, select that item
    let hashFirstSlash = hash.indexOf("\\/");
    if (hashFirstSlash !== -1) {
      let hashTarget = hash.substring(hashFirstSlash);
      let indFromHash = SVs.indByEscapedComponentName[hashTarget];

      if (indFromHash !== undefined && indFromHash !== SVs.selectedItemInd) {
        // have an item from the browser that isn't hte current selected one
        setSelectedItemInd(indFromHash);
      }
    }
  }, [hash]);

  if (SVs.hidden) {
    return null;
  }

  let firstSlash = id.indexOf("\\/");
  let prefix = id.substring(0, firstSlash);
  let urlStart = search + "#" + prefix;

  let initials = SVs.allInitials.map((initial) => (
    <Link
      key={initial}
      style={{
        padding: "0 5px",
        width: "10px",
        cursor: "pointer",
        color: "var(--mainBlue)",
        textDecoration: initial === SVs.initial ? "underline" : "none",
      }}
      to={urlStart + cesc(SVs.firstComponentNameByInitial[initial])}
    >
      {initial}
    </Link>
  ));

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

  let videoChild = children[0];
  children = children.slice(1);

  let descriptionAndVideo = (
    <div
      style={{
        width: "70%",
        display: "flex",
        flexDirection: "column",
        marginTop: "12px",
        marginLeft: "5%",
      }}
      data-test="descriptionAndVideo"
    >
      <div>
        <h4>
          {SVs.selectedItemLabel
            ? `The ${SVs.selectedItemLabel} component`
            : null}
        </h4>
        {SVs.selectedItemDescription}
      </div>
      <div>{videoChild}</div>
    </div>
  );

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div id={id}>
        <a name={id} />
        <div style={{ display: "flex" }} data-test="initials">
          Filter by: {initials}
        </div>
        <div style={{ display: "flex" }}>
          {labelPicker}
          {descriptionAndVideo}
        </div>
        {children}
      </div>
    </VisibilitySensor>
  );
});
