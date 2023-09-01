import React from "../../_snowpack/pkg/react.js";
import {showCompletedAtom, showOverdueAtom} from "../Widgets/Next7Days.js";
import Checkbox from "../../_reactComponents/PanelHeaderComponents/Checkbox.js";
import {useRecoilState} from "../../_snowpack/pkg/recoil.js";
export default function CurrentContent() {
  const [overdue, setOverdue] = useRecoilState(showOverdueAtom);
  const [completed, setCompleted] = useRecoilState(showCompletedAtom);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "2px"},
    checked: completed,
    onClick: (e) => {
      setCompleted(!completed);
    }
  }), "Show Completed", " "), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "2px"},
    checked: overdue,
    onClick: (e) => {
      setOverdue(!overdue);
    }
  }), "Show Overdue", " "));
}
