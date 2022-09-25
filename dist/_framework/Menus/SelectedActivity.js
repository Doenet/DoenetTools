import {faFileCode} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {toastType, useToast} from "../Toast.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState, atom} from "../../_snowpack/pkg/recoil.js";
import {useActivity} from "../../_reactComponents/Activity/ActivityActions.js";
import {
  AssignedDate,
  AssignTo,
  AssignUnassignActivity,
  AttemptLimit,
  AttemptAggregation,
  DueDate,
  GradeCategory,
  ItemWeights,
  Individualize,
  MakePublic,
  PinAssignment,
  ProctorMakesAvailable,
  ShowCorrectness,
  ShowCreditAchieved,
  Paginate,
  ShowFinishButton,
  ShowDoenetMLSource,
  ShowFeedback,
  ShowHints,
  ShowSolution,
  ShowSolutionInGradebook,
  TimeLimit,
  TotalPointsOrPercent
} from "../../_reactComponents/Activity/SettingComponents.js";
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
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
export default function SelectedActivity() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const {canEditContent} = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const {label: recoilLabel, content} = useRecoilValue(itemByDoenetId(doenetId));
  const {renameItem, create, compileActivity, deleteItem} = useCourse(courseId);
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(recoilLabel);
  const addToast = useToast();
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
  if (doenetId == void 0) {
    return null;
  }
  let firstPageDoenetId = findFirstPageOfActivity(content);
  let heading = /* @__PURE__ */ React.createElement("h2", {
    "data-test": "infoPanelItemLabel",
    style: {margin: "16px 5px"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faFileCode
  }), " ", recoilLabel);
  if (canEditContent === "1") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(ActionButtonGroup, {
      vertical: true
    }, /* @__PURE__ */ React.createElement(ActionButton, {
      width: "menu",
      value: "Edit Activity",
      "data-test": "Edit Activity",
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
      "data-test": "View Draft Activity",
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
      "data-test": "View Assigned Activity",
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
    })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(AssignUnassignActivity, {
      doenetId,
      courseId
    }), /* @__PURE__ */ React.createElement(Textfield, {
      label: "Label",
      "data-test": "Label Activity",
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
    }), /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      onClick: () => create({itemType: "order"}),
      value: "Add Order",
      "data-test": "Add Order"
    }), /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      onClick: () => create({itemType: "collectionLink"}),
      "data-test": "Add Collection Link",
      value: "Add Collection Link"
    })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(AssignmentSettings, {
      doenetId,
      courseId
    }), /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      value: "Delete Activity",
      "data-test": "Delete Activity",
      alert: true,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteItem({doenetId});
      }
    }));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    "data-test": "View Activity",
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
    doenetId,
    courseId
  }));
}
const temporaryRestrictToAtom = atom({
  key: "temporaryRestrictToAtom",
  default: []
});
export function AssignmentSettings({doenetId, courseId}) {
  const {canModifyActivitySettings, canViewActivitySettings} = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const {
    value: {
      numberOfAttemptsAllowed,
      timeLimit,
      assignedDate,
      dueDate,
      totalPointsOrPercent
    }
  } = useActivity(courseId, doenetId);
  const sharedProps = {
    courseId,
    doenetId,
    editable: canModifyActivitySettings ?? "0"
  };
  if (canViewActivitySettings === "1") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AssignTo, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(AssignedDate, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(DueDate, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(TimeLimit, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(AttemptLimit, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(AttemptAggregation, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(TotalPointsOrPercent, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(GradeCategory, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(ItemWeights, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement("div", {
      style: {margin: "16px 0"}
    }, /* @__PURE__ */ React.createElement(Individualize, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(ShowSolution, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(ShowSolutionInGradebook, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(ShowFeedback, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(ShowHints, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(ShowCorrectness, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(ShowCreditAchieved, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(Paginate, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(ShowFinishButton, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(ProctorMakesAvailable, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(MakePublic, {
      ...sharedProps
    }), /* @__PURE__ */ React.createElement(ShowDoenetMLSource, {
      ...sharedProps
    })), /* @__PURE__ */ React.createElement(PinAssignment, {
      ...sharedProps
    }));
  }
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
