import React from "../_snowpack/pkg/react.js";
import {atom, useRecoilValue} from "../_snowpack/pkg/recoil.js";
export const darkModeAtom = atom({
  key: "darkModeAtom",
  default: JSON.parse(localStorage.getItem("theme")),
  effects: [
    ({onSet}) => {
      onSet((newValue) => {
        localStorage.setItem("theme", JSON.stringify(newValue));
      });
    }
  ]
});
export default function DarkmodeController({children}) {
  const atomPrefernce = useRecoilValue(darkModeAtom);
  return /* @__PURE__ */ React.createElement("div", {
    "data-theme": atomPrefernce
  }, children);
}
