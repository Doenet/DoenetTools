import React, { useEffect } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import VisibilitySensor from "react-visibility-sensor-v2";

export default React.memo(function ExampleBrowser(props) {
  let { name, id, SVs, children, actions, callAction } =
    useDoenetRenderer(props);

  let onChangeVisibility = (isVisible) => {
    if (actions.recordVisibilityChange) {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible },
      });
    }
  };

  let setInitial = (initial) => {
    callAction({
      action: actions.setInitial,
      args: { initial },
    });
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

  if (SVs.hidden) {
    return null;
  }

  let initials = SVs.allInitials.map((initial) => (
    <div
      key={initial}
      style={{
        padding: "0 5px",
        width: "10px",
        cursor: "pointer",
        color: "var(--mainBlue)",
        textDecoration: initial === SVs.initial ? "underline" : "none",
      }}
      onClick={() => setInitial(initial)}
    >
      {initial}
    </div>
  ));

  let labels = SVs.itemInfoForInitial.map((itemInfo) => (
    <div
      key={itemInfo.ind}
      style={{
        padding: "4px",
        width: "100%",
        cursor: "pointer",
        backgroundColor: itemInfo.selected
          ? "var(--mainGray)"
          : "var(--canvas)",
      }}
      onClick={() => setSelectedItemInd(itemInfo.ind)}
    >
      {itemInfo.label}
    </div>
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
