import React from "../../_snowpack/pkg/react.js";
import {useRecoilState} from "../../_snowpack/pkg/recoil.js";
import {activityVariantInfoAtom, activityVariantPanelAtom} from "../ToolHandlers/CourseToolHandler.js";
export default function ActivityVariant(props) {
  const [variantInfo, setVariantInfo] = useRecoilState(activityVariantInfoAtom);
  const [variantPanel, setVariantPanel] = useRecoilState(activityVariantPanelAtom);
  function updateVariantInfoAtom() {
    if (variantPanel.index === variantInfo.index) {
      return;
    }
    setVariantInfo((was) => {
      let newObj = {...was};
      newObj.index = Number.isFinite(Number(variantPanel.index)) ? Number(variantPanel.index) : 0;
      return newObj;
    });
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Variant Index ", /* @__PURE__ */ React.createElement("input", {
    type: "text",
    value: variantPanel.index,
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        updateVariantInfoAtom();
      }
    },
    onBlur: () => updateVariantInfoAtom(),
    onChange: (e) => {
      setVariantPanel((was) => {
        let newObj = {...was};
        newObj.index = e.target.value;
        return newObj;
      });
    }
  }))));
}
