import {faLayerGroup} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {itemByDoenetId, selectedCourseItems, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import {useToast} from "../Toast.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default function SelectedBank() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(itemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {renameItem} = useCourse(courseId);
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(itemObj.label);
  let {create, deleteItem} = useCourse(courseId);
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
    "data-test": "infoPanelItemLabel",
    style: {margin: "16px 5px"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faLayerGroup
  }), " ", itemObj.label);
  if (effectiveRole === "student") {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(Textfield, {
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
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => create({itemType: "page"}),
    value: "Add Page"
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Delete Collection",
    alert: true,
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteItem({doenetId});
    }
  }));
}
