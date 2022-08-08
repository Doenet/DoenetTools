import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faPuzzlePiece as puzzle} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
export default React.memo(function Solution(props) {
  let {name, SVs, children, actions, callAction} = useDoenetRender(props);
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
  if (SVs.hidden) {
    return null;
  }
  let icon;
  let childrenToRender = null;
  let infoBlockStyle = {display: "none"};
  let onClickFunction;
  let cursorStyle;
  if (SVs.open) {
    icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: puzzle
    });
    childrenToRender = children;
    infoBlockStyle = {
      display: "block",
      margin: "0px 4px 12px 4px",
      padding: "6px",
      border: "2px solid var(--canvastext)",
      borderTop: "0px",
      borderBottomLeftRadius: "5px",
      borderBottomRightRadius: "5px",
      backgroundColor: "var(--canvas)"
    };
    if (SVs.canBeClosed) {
      cursorStyle = "pointer";
      onClickFunction = () => {
        callAction({
          action: actions.closeSolution
        });
      };
    } else {
      onClickFunction = () => {
      };
    }
  } else {
    icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: puzzle,
      rotation: 90
    });
    cursorStyle = "pointer";
    onClickFunction = () => {
      callAction({
        action: actions.revealSolution
      });
    };
  }
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("aside", {
    id: name,
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("span", {
    id: name + "_button",
    style: {
      display: "block",
      margin: SVs.open ? "12px 4px 0px 4px" : "12px 4px 12px 4px",
      padding: "6px",
      border: "2px solid var(--canvastext)",
      borderTopLeftRadius: "5px",
      borderTopRightRadius: "5px",
      borderBottomLeftRadius: SVs.open ? "0px" : "5px",
      borderBottomRightRadius: SVs.open ? "0px" : "5px",
      backgroundColor: "var(--mainGray)",
      cursor: "pointer"
    },
    onClick: onClickFunction
  }, icon, " Solution ", SVs.message), /* @__PURE__ */ React.createElement("span", {
    style: infoBlockStyle
  }, childrenToRender)));
});
