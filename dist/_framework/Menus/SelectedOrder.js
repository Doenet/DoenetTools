import {
  faFileExport
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import Increment from "../../_reactComponents/PanelHeaderComponents/IncrementMenu.js";
import Checkbox from "../../_reactComponents/PanelHeaderComponents/Checkbox.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {itemByDoenetId, selectedCourseItems, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import DropdownMenu from "../../_reactComponents/PanelHeaderComponents/DropdownMenu.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const CheckboxLabelText = styled.span`
  font-size: 15px;
  line-height: 1.1
`;
export default function SelectedOrder() {
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(itemByDoenetId(doenetId));
  const parentItemObj = useRecoilValue(itemByDoenetId(itemObj.parentDoenetId));
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const [behavior, setBehavior] = useState(itemObj.behavior);
  const [numberToSelect, setNumberToSelect] = useState(itemObj.numberToSelect);
  const [withReplacement, setWithReplacement] = useState(itemObj.withReplacement);
  let {create, updateOrderBehavior, deleteItem} = useCourse(courseId);
  let deleteDisabled = false;
  if (parentItemObj.type == "activity") {
    deleteDisabled = true;
  }
  useEffect(() => {
    if (itemObj.behavior != behavior) {
      setBehavior(itemObj.behavior);
    }
    if (itemObj.numberToSelect != numberToSelect) {
      setNumberToSelect(itemObj.numberToSelect);
    }
    if (itemObj.withReplacement != withReplacement) {
      setWithReplacement(itemObj.withReplacement);
    }
  }, [itemObj.doenetId]);
  let heading = /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "infoPanelItemLabel",
    style: {margin: "16px 5px"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faFileExport
  }), " ", itemObj.label);
  let items = [
    ["sequence", "sequence"],
    ["shuffle", "shuffle"],
    ["select", "select"]
  ];
  let defaultIndex = 0;
  for (let [i, item] of Object.entries(items)) {
    if (item[0] === behavior) {
      defaultIndex = Number(i) + 1;
      break;
    }
  }
  let selectionJSX = null;
  if (behavior == "select") {
    selectionJSX = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Increment, {
      min: 0,
      label: "Number to select",
      vertical: true,
      value: numberToSelect,
      onChange: (value) => {
        let number = Number(value);
        if (isNaN(value)) {
          number = 0;
        }
        setNumberToSelect(number);
        updateOrderBehavior({doenetId, behavior, numberToSelect: number, withReplacement});
      }
    }), /* @__PURE__ */ React.createElement(Checkbox, {
      style: {marginRight: "5px"},
      checked: withReplacement,
      onClick: (e) => {
        setWithReplacement((prev) => !prev);
        updateOrderBehavior({doenetId, behavior, numberToSelect, withReplacement: !withReplacement});
      }
    }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, "with replacement"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(DropdownMenu, {
    width: "menu",
    items,
    defaultIndex,
    onChange: ({value}) => {
      setBehavior(value);
      updateOrderBehavior({doenetId, behavior: value, numberToSelect, withReplacement});
    }
  }), /* @__PURE__ */ React.createElement("br", null), selectionJSX, /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => create({itemType: "page"}),
    value: "Add Page"
  }), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => create({itemType: "order"}),
    value: "Add Order"
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Delete Order",
    alert: true,
    disabled: deleteDisabled,
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteItem({doenetId});
    }
  }));
}
