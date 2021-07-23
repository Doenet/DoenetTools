import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {globalSelectedNodesAtom} from "../../_reactComponents/Drive/NewDrive.js";
export default function SelectedDoenetId(props) {
  const selection = useRecoilValue(globalSelectedNodesAtom);
  console.log(">>> SelectedDoenetId selection", selection);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "You have selected ID '", selection, "'"));
}
