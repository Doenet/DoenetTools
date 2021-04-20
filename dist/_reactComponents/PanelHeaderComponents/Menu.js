import React from "../../_snowpack/pkg/react.js";
import {
  atom,
  useRecoilValue
} from "../../_snowpack/pkg/recoil.js";
import {roleAtom} from "../../Tools/DoenetCourse";
const MenuContext = React.createContext(null);
export default function Menu(props) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const role = useRecoilValue(roleAtom);
  const [selection, setSelection] = React.useState([{value: role}]);
  const toggle = React.useCallback(() => setMenuOpen((oldOpen) => !oldOpen), []);
  const handleSelection = React.useCallback((item) => {
    if (selection.find((current) => current.value === item.value)) {
      setSelection([]);
    } else {
      setSelection([item]);
      try {
        item.action(item.value);
        item.role(item.value);
      } catch (err) {
        console.log(err);
      }
    }
    toggle();
  }, [selection, toggle]);
  const value = React.useMemo(() => ({selection, makeSelection: handleSelection}), [selection, handleSelection]);
  const selectedValue = React.useMemo(() => selection[0] ? selection[0].value : "Select...", [selection]);
  return /* @__PURE__ */ React.createElement(MenuContext.Provider, {
    value
  }, /* @__PURE__ */ React.createElement("div", {
    className: "menu-container",
    onBlur: () => setMenuOpen(false),
    tabIndex: -1
  }, /* @__PURE__ */ React.createElement("div", {
    className: "menu-label"
  }, props.label), /* @__PURE__ */ React.createElement("div", {
    role: "button",
    className: "menu-button",
    onClick: toggle
  }, /* @__PURE__ */ React.createElement("span", {
    className: "menu-option-label"
  }, selectedValue), /* @__PURE__ */ React.createElement("svg", {
    className: "menu-button-icon",
    width: 12,
    height: 12
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M2,5 L10,5 6,1 2,5 M2,7 L10,7 6,11 2,7",
    fill: "#000"
  }))), menuOpen && /* @__PURE__ */ React.createElement("div", {
    className: "menu-item-container"
  }, /* @__PURE__ */ React.createElement("ul", null, props.children))));
}
export function useMenuContext() {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error(`Menu compound components cannot be rendered outside the Menu component`);
  }
  return context;
}
