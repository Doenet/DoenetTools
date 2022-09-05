import {faLayerGroup} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {
  itemByDoenetId,
  selectedCourseItems,
  useCourse
} from "../../_reactComponents/Course/CourseActions.js";
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {useToast} from "../Toast.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default function SelectedBank() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const {canEditContent} = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const {label: recoilLabel} = useRecoilValue(itemByDoenetId(doenetId));
  const {renameItem} = useCourse(courseId);
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(recoilLabel);
  let {create, deleteItem} = useCourse(courseId);
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
    icon: faLayerGroup
  }), " ", recoilLabel);
  if (canEditContent === "1") {
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
      value: "Add Page",
      "data-test": "Add Page"
    })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      value: "Delete Collection",
      "data-test": "Delete Collection",
      alert: true,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteItem({doenetId});
      }
    }));
  }
  return null;
}
