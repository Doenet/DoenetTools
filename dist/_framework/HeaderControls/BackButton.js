import React from "../../_snowpack/pkg/react.js";
import {useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default function BackButton() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  return /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setPageToolView({back: true}),
    value: "Back"
  });
}
