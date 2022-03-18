import React from "../../_snowpack/pkg/react.js";
import {useRecoilState} from "../../_snowpack/pkg/recoil.js";
import {variantInfoAtom, variantPanelAtom} from "../ToolHandlers/CourseToolHandler.js";
export default function Variant(props) {
  const [variantInfo, setVariantInfo] = useRecoilState(variantInfoAtom);
  const [variantPanel, setVariantPanel] = useRecoilState(variantPanelAtom);
  function updateVariantInfoAtom(source) {
    if (source === "Index") {
      if (variantPanel.index === variantInfo.index) {
        return;
      }
    }
    if (source === "Name") {
      if (variantPanel.name === variantInfo.name) {
        return;
      }
    }
    setVariantInfo((was) => {
      let newObj = {...was};
      newObj.index = Number.isFinite(Number(variantPanel.index)) ? Number(variantPanel.index) : 0;
      newObj.name = variantPanel.name;
      newObj.lastUpdatedIndexOrName = source;
      return newObj;
    });
  }
  let allPossibleVariants = [];
  if (variantPanel.allPossibleVariants) {
    allPossibleVariants = variantPanel.allPossibleVariants;
  }
  let optionsList = allPossibleVariants.map(function(s, i) {
    return /* @__PURE__ */ React.createElement("option", {
      key: i + 1,
      value: s
    }, s);
  });
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Variant Index ", /* @__PURE__ */ React.createElement("input", {
    type: "text",
    value: variantPanel?.index ?? "0",
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        updateVariantInfoAtom("Index");
      }
    },
    onBlur: () => updateVariantInfoAtom("Index"),
    onChange: (e) => {
      setVariantPanel((was) => {
        let newObj = {...was};
        newObj.index = e.target.value;
        return newObj;
      });
    }
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Variant Name", /* @__PURE__ */ React.createElement("select", {
    value: variantPanel?.name ?? "a",
    onChange: (e) => {
      setVariantInfo((was) => {
        let newObj = {...was};
        newObj.name = e.target.value;
        newObj.lastUpdatedIndexOrName = "Name";
        return newObj;
      });
    }
  }, optionsList))));
}
