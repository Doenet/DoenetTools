import {faCode, faLayerGroup} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useState} from "../../_snowpack/pkg/react.js";
import {useEffect} from "../../_snowpack/pkg/react.js";
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import useSockets from "../../_reactComponents/Sockets.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {AssignmentSettings, selectedInformation} from "./SelectedDoenetML.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
export default function SelectedCollection() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const setSelectedMenu = useSetRecoilState(selectedMenuPanelAtom);
  const selection = useRecoilValueLoadable(selectedInformation).getValue();
  const [item, setItem] = useState(selection[0]);
  const [label, setLabel] = useState(item?.label ?? "");
  const {deleteItem, renameItem} = useSockets("drive");
  useEffect(() => {
    if (selection[0]) {
      setLabel(selection[0]?.label);
      setItem(selection[0]);
    } else {
      setSelectedMenu("");
    }
  }, [selection, setSelectedMenu]);
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
  if (effectiveRole === "student") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", {
      "data-cy": "infoPanelItemLabel"
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCode
    }), " ", item.label), /* @__PURE__ */ React.createElement(ActionButton, {
      width: "menu",
      value: "Take Assignment",
      onClick: () => {
        setPageToolView({
          page: "course",
          tool: "assignment",
          view: "",
          params: {
            doenetId: item?.doenetId
          }
        });
      }
    }), /* @__PURE__ */ React.createElement(AssignmentSettings, {
      role: effectiveRole,
      doenetId: item.doenetId
    }));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "infoPanelItemLabel"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faLayerGroup
  }), " ", item.label), /* @__PURE__ */ React.createElement(ActionButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(ActionButton, {
    value: "Edit Collection",
    width: "menu",
    onClick: () => {
      setPageToolView({
        page: "course",
        tool: "collection",
        view: "",
        params: {
          doenetId: item.doenetId,
          path: `${item.driveId}:${item.parentFolderId}:${item.itemId}:Collection`
        }
      });
    }
  })), /* @__PURE__ */ React.createElement(Textfield, {
    label: "Collection Label",
    width: "menu",
    vertical: true,
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
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(AssignmentSettings, {
    role: effectiveRole,
    doenetId: item.doenetId
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    alert: true,
    width: "menu",
    "data-cy": "deleteDoenetMLButton",
    value: "Delete Collection",
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
