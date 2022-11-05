import React from "../../_snowpack/pkg/react.js";
import {useRecoilState, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import Increment from "../../_reactComponents/PanelHeaderComponents/IncrementMenu.js";
import {activityVariantPanelAtom} from "../../_sharedRecoil/PageViewerRecoil.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
export default function ActivityVariant(props) {
  const [variantPanel, setVariantPanel] = useRecoilState(activityVariantPanelAtom);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  function updateVariantInfoAtom() {
    setPageToolView((was) => {
      let newObj = {...was};
      if (newObj.params) {
        newObj.params = {...newObj.params};
      } else {
        newObj.params = {};
      }
      newObj.params.requestedVariant = variantPanel.index && Number.isFinite(Number(variantPanel.index)) ? Number(variantPanel.index) : 1;
      return newObj;
    });
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(Increment, {
    min: 1,
    value: variantPanel.index,
    onBlur: () => updateVariantInfoAtom(),
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        updateVariantInfoAtom();
      }
    },
    onChange: (value) => {
      setVariantPanel((was) => {
        let newObj = {...was};
        newObj.index = value;
        return newObj;
      });
    }
  }));
}
