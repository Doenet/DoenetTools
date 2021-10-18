import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import useSockets, {itemType} from "../../_reactComponents/Sockets.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
export default function AddDriveItems() {
  const [driveId, parentFolderId] = useRecoilValue(searchParamAtomFamily("path")).split(":");
  const {addItem} = useSockets("drive");
  return /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => addItem({
      driveIdFolderId: {driveId, folderId: parentFolderId},
      type: itemType.DOENETML
    }),
    value: "Add DoenetML"
  }, "Add DoenetML"), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => addItem({
      driveIdFolderId: {driveId, folderId: parentFolderId},
      type: itemType.COLLECTION
    }),
    value: "Add Collection"
  }), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => addItem({
      driveIdFolderId: {driveId, folderId: parentFolderId},
      type: itemType.FOLDER
    }),
    value: "Add Folder"
  }, "Add Folder"));
}
