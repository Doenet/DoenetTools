import React from "../../_snowpack/pkg/react.js";
import {showCompletedAtom, showOverdueAtom} from "../Widgets/Next7Days.js";
import Switch from "../Switch.js";
import {useRecoilState} from "../../_snowpack/pkg/recoil.js";
export default function CurrentContent() {
  const [overdue, setOverdue] = useRecoilState(showOverdueAtom);
  const [completed, setCompleted] = useRecoilState(showCompletedAtom);
  return /* @__PURE__ */ React.createElement("div", null, "Show Completed ", /* @__PURE__ */ React.createElement(Switch, {
    checked: completed,
    onChange: (e) => {
      setCompleted(e.target.checked);
    }
  }), "Show Overdue ", /* @__PURE__ */ React.createElement(Switch, {
    checked: overdue,
    onChange: (e) => {
      setOverdue(e.target.checked);
    }
  }));
}
