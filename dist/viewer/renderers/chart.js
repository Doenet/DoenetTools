import React, {useEffect, useState, useRef, createContext} from "../../_snowpack/pkg/react.js";
import {sizeToCSS} from "./utils/css.js";
import useDoenetRender from "./useDoenetRenderer.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
export const BoardContext = createContext();
export default React.memo(function Chart(props) {
  let {name, SVs, actions, callAction} = useDoenetRender(props);
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("div", {
    id: name
  })));
});
function extractColumn(data, colInd) {
  let dataColumn = [];
  for (let row of data) {
    if (row[colInd] !== null) {
      dataColumn.push(row[colInd]);
    }
  }
  return dataColumn;
}
