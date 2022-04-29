import {faFileCode} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useState, useEffect, useLayoutEffect, useRef} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {
  selector,
  useRecoilValue,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import {useToast, toastType} from "../Toast.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {
  authorItemByDoenetId,
  findFirstPageOfActivity,
  selectedCourseItems,
  useCourse
} from "../../_reactComponents/Course/CourseActions.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default function SelectedActivity() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(authorItemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {
    renameItem,
    create,
    compileActivity,
    deleteItem
  } = useCourse(courseId);
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(itemObj.label);
  const addToast = useToast();
  useEffect(() => {
    if (itemTextFieldLabel !== itemObj.label) {
      setItemTextFieldLabel(itemObj.label);
    }
  }, [doenetId]);
  if (doenetId == void 0) {
    return null;
  }
  let firstPageDoenetId = findFirstPageOfActivity(itemObj.order);
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
  let heading = /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "infoPanelItemLabel",
    style: {margin: "16px 5px"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faFileCode
  }), " ", itemObj.label);
  if (effectiveRole === "student") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(ActionButton, {
      width: "menu",
      value: "Take Assignment",
      onClick: () => {
        setPageToolView({
          page: "course",
          tool: "assignment",
          view: "",
          params: {
            doenetId
          }
        });
      }
    }), /* @__PURE__ */ React.createElement(AssignmentSettings, {
      role: effectiveRole,
      doenetId
    }));
  }
  let assignActivityText = "Assign Activity";
  if (itemObj.assignedCid != null) {
    assignActivityText = "Update Assigned Activity";
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(ActionButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "Edit Activity",
    onClick: () => {
      if (firstPageDoenetId == null) {
        addToast(`ERROR: No page found in activity`, toastType.INFO);
      } else {
        setPageToolView((prev) => {
          return {
            page: "course",
            tool: "editor",
            view: prev.view,
            params: {
              doenetId,
              pageId: firstPageDoenetId,
              sectionId: itemObj.parentDoenetId,
              courseId: prev.params.courseId
            }
          };
        });
      }
    }
  }), /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "View Draft Activity",
    onClick: () => {
      compileActivity({
        activityDoenetId: doenetId,
        courseId,
        successCallback: () => {
          setPageToolView({
            page: "course",
            tool: "draftactivity",
            view: "",
            params: {
              courseId,
              doenetId,
              sectionId: itemObj.parentDoenetId,
              requestedVariant: 1
            }
          });
        }
      });
    }
  }), /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "View Assigned Activity",
    onClick: () => {
      setPageToolView({
        page: "course",
        tool: "assignment",
        view: "",
        params: {
          courseId,
          sectionId: itemObj.parentDoenetId,
          doenetId
        }
      });
    }
  })), /* @__PURE__ */ React.createElement(Textfield, {
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
  }), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => create({itemType: "order"}),
    value: "Add Order"
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: assignActivityText,
    onClick: () => {
      compileActivity({
        activityDoenetId: doenetId,
        isAssigned: true,
        courseId,
        successCallback: () => {
          addToast("Activity Assigned.", toastType.INFO);
        }
      });
    }
  }), /* @__PURE__ */ React.createElement(AssignmentSettings, {
    role: effectiveRole,
    doenetId
  }), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Delete Activity",
    alert: true,
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteItem({doenetId});
    }
  }));
}
export function AssignmentSettings({role, doenetId}) {
  return /* @__PURE__ */ React.createElement("p", null, "AssignmentSettings");
}
