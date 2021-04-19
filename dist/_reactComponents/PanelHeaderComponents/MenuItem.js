import React from "react";
import {useMenuContext} from "./Menu.js";
import {roleAtom} from "../../Tools/DoenetCourse";
import {
  RecoilRoot,
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilState
} from "recoil";
export default function MenuItem(props) {
  const setRole = useSetRecoilState(roleAtom);
  const {selection, makeSelection} = useMenuContext();
  const selected = selection.find((current) => current.value === props.value) ? true : false;
  console.log("selected role >>>", selected);
  return /* @__PURE__ */ React.createElement("li", {
    className: "menu-item",
    role: "button",
    onClick: (e) => {
      makeSelection({value: props.value, action: props.onSelect, role: setRole, event: e});
    }
  }, /* @__PURE__ */ React.createElement("svg", {
    className: "menu-item-checkmark",
    width: 12,
    height: 12
  }, selected && /* @__PURE__ */ React.createElement("path", {
    d: "M2,5 L5.5,8.5 L11,2 ",
    fill: "none",
    stroke: "#000",
    strokeWidth: 2
  })), /* @__PURE__ */ React.createElement("span", {
    className: "menu-item-value"
  }, props.value), /* @__PURE__ */ React.createElement("span", {
    className: "menu-item-icon"
  }, props.icon));
}
