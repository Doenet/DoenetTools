import {
  faFileCode
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {toastType, useToast} from "../Toast.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState, atom} from "../../_snowpack/pkg/recoil.js";
import {useActivity} from "../../_reactComponents/Activity/ActivityActions.js";
import {AssignedDate, AssignTo, AttempLimit, AttemptAggregation, DueDate, GradeCategory, Individualize, MakePublic, PinAssignment, ProctorMakesAvailable, ShowCorrectness, ShowCreditAchieved, ShowDoenetMLSource, ShowFeedback, ShowHints, ShowSolution, ShowSolutionInGradebook, TimeLimit, TotalPointsOrPercent} from "../../_reactComponents/Activity/SettingComponents.js";
import {
  itemByDoenetId,
  findFirstPageOfActivity,
  selectedCourseItems,
  useCourse
} from "../../_reactComponents/Course/CourseActions.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
export default function SelectedActivity() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const {
    label: recoilLabel,
    order,
    isAssigned
  } = useRecoilValue(itemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {
    renameItem,
    create,
    compileActivity,
    deleteItem,
    updateAssignItem
  } = useCourse(courseId);
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(recoilLabel);
  const addToast = useToast();
  useEffect(() => {
    setItemTextFieldLabel(recoilLabel);
  }, [recoilLabel]);
  let firstPageDoenetId = findFirstPageOfActivity(order);
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
  if (doenetId == void 0) {
    return null;
  }
  let heading = /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "infoPanelItemLabel",
    style: {margin: "16px 5px"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faFileCode
  }), " ", recoilLabel);
  if (effectiveRole === "student") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(ActionButton, {
      width: "menu",
      value: "View Activity",
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
      effectiveRole,
      doenetId,
      courseId
    }));
  }
  let assignActivityText = "Assign Activity";
  if (isAssigned) {
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
              pageId: firstPageDoenetId
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
              doenetId,
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
          doenetId
        }
      });
    }
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(ActionButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: assignActivityText,
    onClick: () => {
      compileActivity({
        activityDoenetId: doenetId,
        isAssigned: true,
        courseId
      });
      updateAssignItem({
        doenetId,
        isAssigned: true,
        successCallback: () => {
          addToast("Activity Assigned", toastType.INFO);
        }
      });
    }
  }), isAssigned ? /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "Unassign Activity",
    alert: true,
    onClick: () => {
      updateAssignItem({
        doenetId,
        isAssigned: false,
        successCallback: () => {
          addToast("Activity Unassigned", toastType.INFO);
        }
      });
    }
  }) : null), /* @__PURE__ */ React.createElement(Textfield, {
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
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(AssignmentSettings, {
    effectiveRole,
    doenetId,
    courseId
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
const temporaryRestrictToAtom = atom({
  key: "temporaryRestrictToAtom",
  default: []
});
export function AssignmentSettings({effectiveRole, doenetId, courseId}) {
  const {value: {numberOfAttemptsAllowed, timeLimit, assignedDate, dueDate, totalPointsOrPercent}} = useActivity(courseId, doenetId);
  if (effectiveRole === "student") {
    let nAttemptsAllowed = numberOfAttemptsAllowed;
    if (nAttemptsAllowed === null) {
      nAttemptsAllowed = "unlimited";
    }
    let timeLimitJSX = null;
    if (timeLimit !== null) {
      timeLimitJSX = /* @__PURE__ */ React.createElement("p", null, "Time Limit: ", timeLimit, " minutes");
    }
    let assignedDateJSX = null;
    if (assignedDate !== null) {
      assignedDateJSX = /* @__PURE__ */ React.createElement("p", null, "Assigned: ", assignedDate);
    }
    let dueDateJSX = /* @__PURE__ */ React.createElement("p", null, "No Due Date");
    if (dueDate !== null) {
      dueDateJSX = /* @__PURE__ */ React.createElement("p", null, "Due: ", dueDate);
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, assignedDateJSX, dueDateJSX, timeLimitJSX, /* @__PURE__ */ React.createElement("p", null, "Attempts Allowed: ", nAttemptsAllowed), /* @__PURE__ */ React.createElement("p", null, "Points: ", totalPointsOrPercent)));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AssignTo, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(AssignedDate, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(DueDate, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(TimeLimit, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(AttempLimit, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(AttemptAggregation, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(TotalPointsOrPercent, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(GradeCategory, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement("div", {
    style: {margin: "16px 0"}
  }, /* @__PURE__ */ React.createElement(Individualize, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(ShowSolution, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(ShowSolutionInGradebook, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(ShowFeedback, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(ShowHints, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(ShowCorrectness, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(ShowCreditAchieved, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(ProctorMakesAvailable, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(MakePublic, {
    courseId,
    doenetId
  }), /* @__PURE__ */ React.createElement(ShowDoenetMLSource, {
    courseId,
    doenetId
  })), /* @__PURE__ */ React.createElement(PinAssignment, {
    courseId,
    doenetId
  }));
}
