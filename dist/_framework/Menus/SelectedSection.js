import {faFolderTree} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {
  itemByDoenetId,
  selectedCourseItems,
  useCourse
} from "../../_reactComponents/Course/CourseActions.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {toastType, useToast} from "../Toast.js";
export default function SelectedSection() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const {canEditContent} = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const {label: recoilLabel, isAssigned} = useRecoilValue(itemByDoenetId(doenetId));
  const {renameItem, deleteItem} = useCourse(courseId);
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(recoilLabel);
  const {updateAssignItem} = useCourse(courseId);
  let assignSectionText = "Assign Section";
  if (isAssigned) {
    assignSectionText = "Unassign Section";
  }
  useEffect(() => {
    setItemTextFieldLabel(recoilLabel);
  }, [recoilLabel]);
  const handelLabelModfication = () => {
    let effectiveItemLabel = itemTextFieldLabel;
    if (itemTextFieldLabel === "") {
      effectiveItemLabel = recoilLabel;
      if (recoilLabel === "") {
        effectiveItemLabel = "Untitled";
      }
      setItemTextFieldLabel(effectiveItemLabel);
      addToast("Every item must have a label.");
    }
    if (recoilLabel !== effectiveItemLabel) {
      renameItem(doenetId, effectiveItemLabel);
    }
  };
  const addToast = useToast();
  let heading = /* @__PURE__ */ React.createElement("h2", {
    "data-test": "infoPanelItemLabel",
    style: {margin: "16px 5px"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faFolderTree
  }), " ", recoilLabel);
  if (canEditContent === "1") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(ActionButton, {
      width: "menu",
      value: assignSectionText,
      onClick: () => {
        let toastText = "Section Assigned.";
        if (isAssigned) {
          toastText = "Section Unassigned.";
        }
        updateAssignItem({
          doenetId,
          isAssigned: !isAssigned,
          successCallback: () => {
            addToast(toastText, toastType.INFO);
          }
        });
      }
    }), /* @__PURE__ */ React.createElement(Textfield, {
      label: "Label",
      vertical: true,
      width: "menu",
      value: itemTextFieldLabel,
      onChange: (e) => setItemTextFieldLabel(e.target.value),
      onKeyDown: (e) => {
        if (e.keyCode === 13)
          handelLabelModfication();
      },
      onBlur: handelLabelModfication
    }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      value: "Delete Section",
      alert: true,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteItem({doenetId});
      }
    }));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading);
}
