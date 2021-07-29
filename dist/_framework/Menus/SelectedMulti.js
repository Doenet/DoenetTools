import React from "../../_snowpack/pkg/react.js";
import {useRecoilValueLoadable} from "../../_snowpack/pkg/recoil.js";
import {selectedInformation} from "./SelectedDoenetML.js";
export default function MultiSelect() {
  const selection = useRecoilValueLoadable(selectedInformation).getValue() ?? [];
  return /* @__PURE__ */ React.createElement("div", null, selection.length, " items selected");
}
