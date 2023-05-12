import React, { useEffect } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import VisibilitySensor from "react-visibility-sensor-v2";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { cesc } from "../../_utils/url";

export default React.memo(function ContentBrowser(props) {
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

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div id={id}>
        <a name={id} />
        <div style={{ display: "flex" }} data-test="initials">
          Filter by: {initials}
        </div>
        {children}
      </div>
    </VisibilitySensor>
  );
});
