import React from "../../_snowpack/pkg/react.js";
import {useRecoilState} from "../../_snowpack/pkg/recoil.js";
import {pageVariantInfoAtom, pageVariantPanelAtom} from "../ToolHandlers/CourseToolHandler.js";
export default function PageVariant(props) {
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const [variantPanel, setVariantPanel] = useRecoilState(pageVariantPanelAtom);
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
  let allPossibleVariants = [];
  if (variantPanel.allPossibleVariants) {
    allPossibleVariants = variantPanel.allPossibleVariants;
  }
  let optionsList = allPossibleVariants.map(function(s, i) {
    return /* @__PURE__ */ React.createElement("option", {
      key: i + 1,
      value: i + 1
    }, s);
  });
  let isIgnoredVariant = variantPanel.variantIndicesToIgnore.includes(variantPanel.index);
  let style = {...props.style};
  let warningVariantIsIgnored = null;
  if (isIgnoredVariant) {
    style.backgroundColor = "lightgray";
    warningVariantIsIgnored = /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "This variant is ignored!"));
  }
  let haveIgnoredVariants = variantPanel.variantIndicesToIgnore.length > 0;
  let ignoredVariantListing = null;
  if (haveIgnoredVariants) {
    ignoredVariantListing = /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Variant indices to ignore: "), " ", variantPanel.variantIndicesToIgnore.join(", "));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style
  }, warningVariantIsIgnored, /* @__PURE__ */ React.createElement("div", null, "Number of variants: ", allPossibleVariants.length), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Select variant Index ", /* @__PURE__ */ React.createElement("input", {
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
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Select variant name", /* @__PURE__ */ React.createElement("select", {
    style: {backgroundColor: "var(--canvas)", color: "var(--canvastext)", border: "var(--mainBorder)", borderRadius: "var(--mainBorderRadius)"},
    value: variantPanel.index,
    onChange: (e) => {
      setVariantInfo((was) => {
        let newObj = {...was};
        newObj.index = e.target.value;
        return newObj;
      });
    }
  }, optionsList))), ignoredVariantListing);
}
