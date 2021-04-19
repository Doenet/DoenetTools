import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
const ControlGroupParent = styled.div`
  display: flex;
  justify-content: flex-start;
`;
const CtrlGroup = styled.div`
  display: flex;
  flex-direction: row;
`;
export default function ControlGroup(props) {
  var ctrlGrpRef = useRef();
  var minimizedIcon = props.icon;
  useEffect(() => {
    if (ctrlGrpRef.current) {
      if (props.fromMaximize === void 0 && props.getControlGroupsWidth) {
        props.getControlGroupsWidth(ctrlGrpRef.current.getBoundingClientRect().width);
      }
    }
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ControlGroupParent, {
    ref: ctrlGrpRef
  }, /* @__PURE__ */ React.createElement(CtrlGroup, null, props.children)));
}
