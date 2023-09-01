import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faPuzzlePiece as puzzle} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import P from "../../core/components/P.js";
const SpanStyling = styled.span`
// display: block;
// margin: SVs.open ? 12px 4px 0px 4px : 12px 4px 12px 4px;
// padding: 6px;
// border: 2px solid black;
// border-top-left-radius: 5px;
// border-top-right-radius: 5px;
// border-bottom-left-radius: SVs.open ? 0px : 5px;
// border-bottom-right-radius: SVs.open ? 0px : 5px;
// background-color: var(--mainGray);
// cursor: pointer;
&: focus {
  outline: 2px solid var(--canvastext);
  outline-offset: 2px;
}
`;
export default React.memo(function Solution(props) {
  let {name, id, SVs, children, actions, callAction} = useDoenetRender(props);
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
  let openCloseText = "open";
  if (SVs.hidden) {
    return null;
  }
  let icon;
  let childrenToRender = null;
  let infoBlockStyle = {display: "none"};
  let onClickFunction;
  let cursorStyle;
  let onKeyPressFunction;
  if (SVs.open) {
    icon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: puzzle
    });
    openCloseText = "close";
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
    onKeyPressFunction = (e) => {
      if (e.key === "Enter") {
        callAction({
          action: actions.closeSolution
        });
      }
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
    onKeyPressFunction = (e) => {
      if (e.key === "Enter") {
        callAction({
          action: actions.revealSolution
        });
      }
    };
  }
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("aside", {
    id,
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), /* @__PURE__ */ React.createElement(SpanStyling, {
    style: {
      display: "block",
      margin: SVs.open ? "12px 4px 0px 4px" : "12px 4px 12px 4px",
      padding: "6px",
      border: "2px solid black",
      borderTopLeftRadius: "5px",
      borderTopRightRadius: "5px",
      borderBottomLeftRadius: SVs.open ? "0px" : "5px",
      borderBottomRightRadius: SVs.open ? "0px" : "5px",
      backgroundColor: "var(--mainGray)",
      cursor: "pointer"
    },
    tabIndex: "0",
    id: id + "_button",
    onClick: onClickFunction,
    onKeyDown: onKeyPressFunction
  }, icon, " Solution ", SVs.message, " (click to ", openCloseText, ")"), /* @__PURE__ */ React.createElement("span", {
    style: infoBlockStyle
  }, childrenToRender)));
});
