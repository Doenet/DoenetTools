import {faFolderTree} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {itemByDoenetId, selectedCourseItems, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import {toastType, useToast} from "../Toast.js";
export default function SelectedSection() {
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(itemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {renameItem, deleteItem} = useCourse(courseId);
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(itemObj.label);
  const {updateAssignItem} = useCourse(courseId);
  let assignSectionText = "Assign Section";
  if (itemObj.isAssigned) {
    assignSectionText = "Unassign Section";
  }
  useEffect(() => {
    if (itemTextFieldLabel !== itemObj.label) {
      setItemTextFieldLabel(itemObj.label);
    }
  }, [doenetId]);
  const handelLabelModfication = () => {
    let effectiveItemLabel = itemTextFieldLabel;
    if (itemTextFieldLabel === "") {
      effectiveItemLabel = itemObj.label;
      if (itemObj.label === "") {
        effectiveItemLabel = "Untitled";
      }
      setItemTextFieldLabel(effectiveItemLabel);
      addToast("Every item must have a label.");
    }
    if (itemObj.label !== effectiveItemLabel) {
      renameItem(doenetId, effectiveItemLabel);
    }
  };
  const addToast = useToast();
  let heading = /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "infoPanelItemLabel",
    style: {margin: "16px 5px"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faFolderTree
  }), " ", itemObj.label);
  if (effectiveRole === "student") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, heading);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: assignSectionText,
    onClick: () => {
      console.log("itemObj.isAssigned", itemObj.isAssigned);
      let toastText = "Section Assigned.";
      if (itemObj.isAssigned) {
        toastText = "Section Unassigned.";
      }
      updateAssignItem({
        doenetId,
        isAssigned: !itemObj.isAssigned,
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
