import React from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {toolViewAtom, searchParamAtomFamily, paramObjAtom} from "../NewToolRoot.js";
import {globalSelectedNodesAtom} from "../../_reactComponents/Drive/NewDrive.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
export default function DrivePanel(props) {
  console.log(">>>===DrivePanel");
  const path = useRecoilValue(searchParamAtomFamily("path"));
  const setParamObj = useSetRecoilState(paramObjAtom);
  const setSelections = useRecoilCallback(({set}) => (selections) => {
    console.log(">>>selections", selections);
    set(selectedMenuPanelAtom, "SelectedDoenetId");
    set(globalSelectedNodesAtom, selections);
  });
  if (props.style?.display === "none") {
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    });
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("h1", null, "drive"), /* @__PURE__ */ React.createElement("p", null, "put drive here"), /* @__PURE__ */ React.createElement("div", null, "path: ", path), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: (e) => {
      e.stopPropagation();
      setParamObj((was) => {
        let newObj = {...was};
        newObj["path"] = "f1";
        return newObj;
      });
    }
  }, "path to f1")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: (e) => {
      e.stopPropagation();
      setParamObj((was) => {
        let newObj = {...was};
        newObj["path"] = "f2";
        return newObj;
      });
    }
  }, "path to f2")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: (e) => {
      e.stopPropagation();
      setParamObj((was) => {
        let newObj = {...was};
        newObj["path"] = "f3";
        return newObj;
      });
    }
  }, "path to f3")), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: (e) => {
      e.stopPropagation();
      setSelections(["f1"]);
    }
  }, "select f1")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: (e) => {
      e.stopPropagation();
      setSelections(["f1", "f2"]);
    }
  }, "select f1 and f2")), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: (e) => {
      e.stopPropagation();
      setParamObj({tool: "editor", doenetId: "JRP26MJwT93KkydNtBQpO"});
    }
  }, "Edit c1")));
}
