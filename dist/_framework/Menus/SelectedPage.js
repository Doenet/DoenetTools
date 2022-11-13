import {faCode} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {itemByDoenetId, selectedCourseItems, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import {useToast, toastType} from "../Toast.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
export default function SelectedPage() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const pageId = useRecoilValue(selectedCourseItems)[0];
  const pageObj = useRecoilValue(itemByDoenetId(pageId));
  const containingObj = useRecoilValue(itemByDoenetId(pageObj.containingDoenetId));
  const sectionId = containingObj.parentDoenetId;
  const doenetId = containingObj.doenetId;
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {create, renameItem, compileActivity, deleteItem, copyItems, cutItems} = useCourse(courseId);
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(pageObj.label);
  const addToast = useToast();
  useEffect(() => {
    if (itemTextFieldLabel !== pageObj.label) {
      setItemTextFieldLabel(pageObj.label);
    }
  }, [pageId]);
  const handelLabelModfication = () => {
    let effectiveItemLabel = itemTextFieldLabel;
    if (itemTextFieldLabel === "") {
      effectiveItemLabel = pageObj.label;
      if (pageObj.label === "") {
        effectiveItemLabel = "Untitled";
      }
      setItemTextFieldLabel(effectiveItemLabel);
    }
    if (pageObj.label !== effectiveItemLabel) {
      renameItem(pageId, effectiveItemLabel);
    }
  };
  let heading = /* @__PURE__ */ React.createElement("h2", {
    "data-test": "infoPanelItemLabel",
    style: {margin: "16px 5px"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faCode
  }), " ", pageObj.label);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(ActionButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "Edit Page",
    dataTest: "Edit Page",
    onClick: () => {
      setPageToolView({
        page: "course",
        tool: "editor",
        view: "",
        params: {
          pageId,
          doenetId
        }
      });
    }
  })), /* @__PURE__ */ React.createElement(Textfield, {
    label: "Label",
    dataTest: "Label Page",
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
    dataTest: "Add Page"
  }), containingObj.type == "activity" ? /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => create({itemType: "order"}),
    value: "Add Order",
    dataTest: "Add Order"
  }) : null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Delete Page",
    dataTest: "Delete Page",
    alert: true,
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteItem({doenetId: pageId});
    }
  }));
}
