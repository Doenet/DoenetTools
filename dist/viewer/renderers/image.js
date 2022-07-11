import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {retrieveMediaForCid} from "../../core/utils/retrieveMedia.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
export default React.memo(function Image(props) {
  let {name, SVs, actions, callAction} = useDoenetRender(props, false);
  let [url, setUrl] = useState(null);
  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: {isVisible}
    });
  };
  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: {isVisible: false}
      });
    };
  }, []);
  useEffect(() => {
    if (SVs.cid) {
      retrieveMediaForCid(SVs.cid, SVs.mimeType).then((result) => {
        setUrl(result.mediaURL);
      }).catch((e) => {
      });
    }
  }, []);
  if (SVs.hidden)
    return null;
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), url || SVs.source ? /* @__PURE__ */ React.createElement("img", {
    id: name,
    src: url ? url : SVs.source ? SVs.source : "",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: "850px"
    },
    width: sizeToCSS(SVs.width),
    height: sizeToCSS(SVs.height),
    alt: SVs.description
  }) : /* @__PURE__ */ React.createElement("div", {
    id: name,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: "850px",
      width: sizeToCSS(SVs.width),
      height: sizeToCSS(SVs.height),
      border: "var(--mainBorder)"
    }
  }, SVs.description)));
});
