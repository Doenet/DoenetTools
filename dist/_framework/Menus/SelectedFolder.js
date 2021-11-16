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
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {useToast} from "../Toast.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
export default function SelectedFolder() {
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const setSelectedMenu = useSetRecoilState(selectedMenuPanelAtom);
  const selection = useRecoilValueLoadable(selectedInformation).getValue();
  const [item, setItem] = useState(selection[0]);
  const [label, setLabel] = useState(selection[0]?.label ?? "");
  const {deleteItem, renameItem} = useSockets("drive");
  const addToast = useToast();
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
  if (effectiveRole === "instructor") {
    modControl = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Textfield, {
      label: "Folder Label",
      vertical: true,
      width: "menu",
      "data-cy": "infoPanelItemLabelInput",
      value: label,
      onChange: (e) => setLabel(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          let effectiveLabel = label;
          if (label === "") {
            effectiveLabel = "Untitled";
            addToast("Label for the folder can't be blank.");
            setLabel(effectiveLabel);
          }
          if (item.label !== effectiveLabel) {
            renameItemCallback(effectiveLabel);
            setLabel(effectiveLabel);
          }
        }
      },
      onBlur: () => {
        let effectiveLabel = label;
        if (label === "") {
          effectiveLabel = "Untitled";
          addToast("Label for the folder can't be blank.");
        }
        if (item.label !== effectiveLabel) {
          renameItemCallback(effectiveLabel);
        }
      }
    }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(ButtonGroup, {
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
