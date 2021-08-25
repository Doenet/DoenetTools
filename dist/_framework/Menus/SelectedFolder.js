import {faFolder} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useState} from "../../_snowpack/pkg/react.js";
import {useEffect} from "../../_snowpack/pkg/react.js";
import {useRecoilValueLoadable, useSetRecoilState, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import useSockets from "../../_reactComponents/Sockets.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {selectedInformation} from "./SelectedDoenetML.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
export default function SelectedFolder() {
  const pageToolView = useRecoilValue(pageToolViewAtom);
  const role = pageToolView.view;
  const setSelectedMenu = useSetRecoilState(selectedMenuPanelAtom);
  const selection = useRecoilValueLoadable(selectedInformation).getValue();
  const [item, setItem] = useState(selection[0]);
  const [label, setLabel] = useState(selection[0]?.label ?? "");
  const {deleteItem, renameItem} = useSockets("drive");
  useEffect(() => {
    if (!selection[0]) {
      setSelectedMenu("");
    } else {
      setItem(selection[0]);
      setLabel(selection[0]?.label);
    }
  }, [selection, setSelectedMenu]);
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
  if (!item) {
    return null;
  }
  let modControl = null;
  if (role === "instructor") {
    modControl = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("label", null, item.itemType, " Label", /* @__PURE__ */ React.createElement("input", {
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
    })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(ButtonGroup, {
      vertical: true
    }, /* @__PURE__ */ React.createElement(Button, {
      alert: true,
      width: "menu",
      "data-cy": "deleteDoenetMLButton",
      value: "Delete Folder",
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
    })));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "infoPanelItemLabel"
  }, dIcon, " ", item.label), modControl);
}
