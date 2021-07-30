import {
  faCode,
  faFolder,
  faObjectGroup
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useState} from "../../_snowpack/pkg/react.js";
import {selector, useRecoilValueLoadable, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {
  folderDictionaryFilterSelector,
  globalSelectedNodesAtom
} from "../../_reactComponents/Drive/NewDrive.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import useSockets from "../../_reactComponents/Sockets.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import {selectedInformation} from "./SelectedDoenetML.js";
export default function SelectedCollection() {
  const selection = useRecoilValueLoadable(selectedInformation).getValue() ?? [];
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [label, setLabel] = useState(selection[0]?.label ?? "");
  const {deleteItem, renameItem} = useSockets("drive");
  const item = selection[0];
  const dIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faFolder
  });
  const renameItemCallback = (newLabel) => {
    renameItem({
      driveIdFolderId: {
        driveId: item.driveId,
        folderId: item.parentFolderId
      },
      itemId: item.itemId,
      itemType: item.itemType,
      newLabel
    });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "infoPanelItemLabel"
  }, dIcon, " ", item.label), /* @__PURE__ */ React.createElement("label", null, "DoenetML Label", /* @__PURE__ */ React.createElement("input", {
    type: "text",
    "data-cy": "infoPanelItemLabelInput",
    value: label,
    onChange: (e) => setLabel(e.target.value),
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        if (item.label !== label) {
          renameItemCallback(label);
        }
      }
    },
    onBlur: () => {
      if (item.label !== label) {
        renameItemCallback(label);
      }
    }
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    value: "Edit DoenetML",
    onClick: () => {
      setPageToolView({
        page: "course",
        tool: "editor",
        view: "",
        params: {
          doenetId: item.doenetId,
          path: `${item.driveId}:${item.parentFolderId}:${item.itemId}:DoenetML`
        }
      });
    }
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    "data-cy": "deleteDoenetMLButton",
    value: "Delete DoenetML",
    onClick: () => {
      deleteItem({
        driveIdFolderId: {
          driveId: item.driveId,
          folderId: item.parentFolderId
        },
        itemId: item.itemId,
        driveInstanceId: item.driveInstanceId,
        label: item.label
      });
    }
  }));
}
