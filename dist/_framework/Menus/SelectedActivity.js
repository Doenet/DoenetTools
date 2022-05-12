import {
  faCalendarPlus,
  faCalendarTimes,
  faCheck,
  faFileCode
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {toastType, useToast} from "../Toast.js";
import axios from "../../_snowpack/pkg/axios.js";
import React, {useEffect, useRef, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue, useSetRecoilState, atom} from "../../_snowpack/pkg/recoil.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {
  itemByDoenetId,
  enrollmentByCourseId,
  findFirstPageOfActivity,
  selectedCourseItems,
  useCourse,
  courseIdAtom
} from "../../_reactComponents/Course/CourseActions.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import Checkbox from "../../_reactComponents/PanelHeaderComponents/Checkbox.js";
import DateTime from "../../_reactComponents/PanelHeaderComponents/DateTime.js";
import DropdownMenu from "../../_reactComponents/PanelHeaderComponents/DropdownMenu.js";
import Increment from "../../_reactComponents/PanelHeaderComponents/IncrementMenu.js";
import RelatedItems from "../../_reactComponents/PanelHeaderComponents/RelatedItems.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {
  DateToDateString,
  DateToUTCDateString
} from "../../_utils/dateUtilityFunction.js";
import useDebounce from "../../_utils/hooks/useDebounce.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
const InputWrapper = styled.div`
  margin: 0 5px 10px 5px;
  display: ${(props) => props.flex ? "flex" : "block"};
  align-items: ${(props) => props.flex && "center"};
`;
const LabelText = styled.span`
  margin-bottom: 5px;
`;
const CheckboxLabelText = styled.span`
  font-size: 15px;
  line-height: 1.1;
`;
const InputControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;
  for (var i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i];
    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }
  return result;
}
export default function SelectedActivity() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const {
    label: recoilLabel,
    order,
    assignedCid,
    isAssigned,
    parentDoenetId
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
      role: effectiveRole,
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
    role: effectiveRole,
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
function AssignTo({updateAssignment}) {
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const {
    isGloballyAssigned
  } = useRecoilValue(itemByDoenetId(doenetId));
  const courseId = useRecoilValue(courseIdAtom);
  const {value: enrolledStudents} = useRecoilValue(enrollmentByCourseId(courseId));
  const [restrictedTo, setRestrictedTo] = useState([]);
  async function getAndSetRestrictedTo({courseId: courseId2, doenetId: doenetId2}) {
    let resp = await axios.get("/api/getRestrictedTo.php", {params: {courseId: courseId2, doenetId: doenetId2}});
    setRestrictedTo(resp.data.restrictedTo);
  }
  async function updateRestrictedTo({courseId: courseId2, doenetId: doenetId2, emailAddresses}) {
    let resp = await axios.post("/api/updateRestrictedTo.php", {courseId: courseId2, doenetId: doenetId2, emailAddresses});
    setRestrictedTo(emailAddresses);
  }
  useEffect(() => {
    if (!isGloballyAssigned) {
      getAndSetRestrictedTo({courseId, doenetId});
    }
  }, [doenetId, isGloballyAssigned]);
  let enrolledJSX = enrolledStudents.reduce((allrows, row) => {
    if (row.withdrew == "0") {
      if (!isGloballyAssigned && restrictedTo.includes(row.email)) {
        return [...allrows, /* @__PURE__ */ React.createElement("option", {
          selected: true,
          key: `enrolledOpt${row.email}`,
          value: row.email
        }, row.firstName, " ", row.lastName)];
      } else {
        return [...allrows, /* @__PURE__ */ React.createElement("option", {
          key: `enrolledOpt${row.email}`,
          value: row.email
        }, row.firstName, " ", row.lastName)];
      }
    } else {
      return allrows;
    }
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: !isGloballyAssigned,
    onClick: () => {
      updateAssignment({
        doenetId,
        keyToUpdate: "isGloballyAssigned",
        value: !isGloballyAssigned,
        description: "Restrict Assignment ",
        valueDescription: isGloballyAssigned ? "true" : "false"
      });
    }
  }), /* @__PURE__ */ React.createElement(LabelText, null, "Restrict Assignment To")), /* @__PURE__ */ React.createElement(RelatedItems, {
    width: "menu",
    options: enrolledJSX,
    disabled: isGloballyAssigned,
    onChange: (e) => {
      let emailAddresses = Array.from(e.target.selectedOptions, (option) => option.value);
      updateRestrictedTo({courseId, doenetId, emailAddresses});
    },
    multiple: true
  }));
}
export function AssignmentSettings({role, doenetId, courseId}) {
  let aInfoRef = useRef({});
  const aInfo = aInfoRef?.current;
  const addToast = useToast();
  let [assignedDate, setAssignedDate] = useState("");
  let [dueDate, setDueDate] = useState("");
  let [pinnedUntilDate, setPinnedUntilDate] = useState("");
  let [pinnedAfterDate, setPinnedAfterDate] = useState("");
  let [limitAttempts, setLimitAttempts] = useState(true);
  let [numberOfAttemptsAllowed, setNumberOfAttemptsAllowed] = useState(1);
  let [timeLimit, setTimeLimit] = useState(60);
  let [attemptAggregation, setAttemptAggregation] = useState("");
  let [totalPointsOrPercent, setTotalPointsOrPercent] = useState(100);
  let [gradeCategory, setGradeCategory] = useState("");
  let [individualize, setIndividualize] = useState(true);
  let [showSolution, setShowSolution] = useState(true);
  let [showSolutionInGradebook, setShowSolutionInGradebook] = useState(true);
  let [showFeedback, setShowFeedback] = useState(true);
  let [showHints, setShowHints] = useState(true);
  let [showCorrectness, setShowCorrectness] = useState(true);
  let [showCreditAchievedMenu, setShowCreditAchievedMenu] = useState(true);
  let [proctorMakesAvailable, setProctorMakesAvailable] = useState(true);
  const updateAssignment = useRecoilCallback(({set, snapshot}) => async ({
    doenetId: doenetId2,
    keyToUpdate,
    value,
    description,
    valueDescription = null,
    secondKeyToUpdate = null,
    secondValue
  }) => {
    const oldAInfo = await snapshot.getPromise(itemByDoenetId(doenetId2));
    let newAInfo = {...oldAInfo, courseId, [keyToUpdate]: value};
    if (secondKeyToUpdate) {
      newAInfo[secondKeyToUpdate] = secondValue;
    }
    let dbAInfo = {...newAInfo};
    dbAInfo.assignedDate = dbAInfo?.assignedDate ?? null;
    dbAInfo.dueDate = dbAInfo?.dueDate ?? null;
    dbAInfo.pinnedUntilDate = dbAInfo?.pinnedUntilDate ?? null;
    dbAInfo.pinnedAfterDate = dbAInfo?.pinnedAfterDate ?? null;
    if (dbAInfo.assignedDate !== null) {
      dbAInfo.assignedDate = DateToUTCDateString(new Date(dbAInfo.assignedDate));
    }
    if (dbAInfo.dueDate !== null) {
      dbAInfo.dueDate = DateToUTCDateString(new Date(dbAInfo.dueDate));
    }
    if (dbAInfo.pinnedUntilDate !== null) {
      dbAInfo.pinnedUntilDate = DateToUTCDateString(new Date(dbAInfo.pinnedUntilDate));
    }
    if (dbAInfo.pinnedAfterDate !== null) {
      dbAInfo.pinnedAfterDate = DateToUTCDateString(new Date(dbAInfo.pinnedAfterDate));
    }
    const resp = await axios.post("/api/saveAssignmentToDraft.php", dbAInfo);
    if (resp.data.success) {
      set(itemByDoenetId(doenetId2), newAInfo);
      if (valueDescription) {
        addToast(`Updated ${description} to ${valueDescription}`);
      } else {
        if (description === "Assigned Date" || description === "Due Date" || description === "Pinned Until Date" || description === "Pinned After Date") {
          addToast(`Updated ${description} to ${new Date(value).toLocaleString()}`);
        } else {
          addToast(`Updated ${description} to ${value}`);
        }
      }
    }
  }, [addToast, courseId]);
  const loadRecoilAssignmentValues = useRecoilCallback(({snapshot}) => async (doenetId2) => {
    const aLoadable = await snapshot.getPromise(itemByDoenetId(doenetId2));
    aInfoRef.current = {...aLoadable};
    setAssignedDate(aLoadable?.assignedDate);
    setDueDate(aLoadable?.dueDate);
    setLimitAttempts(aLoadable?.numberOfAttemptsAllowed !== null);
    setNumberOfAttemptsAllowed(aLoadable?.numberOfAttemptsAllowed);
    setAttemptAggregation(aLoadable?.attemptAggregation);
    setTotalPointsOrPercent(aLoadable?.totalPointsOrPercent);
    setGradeCategory(aLoadable?.gradeCategory);
    setIndividualize(aLoadable?.individualize);
    setShowSolution(aLoadable?.showSolution);
    setShowSolutionInGradebook(aLoadable?.showSolutionInGradebook);
    setShowFeedback(aLoadable?.showFeedback);
    setShowHints(aLoadable?.showHints);
    setShowCorrectness(aLoadable?.showCorrectness);
    setShowCreditAchievedMenu(aLoadable?.showCreditAchievedMenu);
    setProctorMakesAvailable(aLoadable?.proctorMakesAvailable);
    setTimeLimit(aLoadable?.timeLimit);
    setPinnedUntilDate(aLoadable?.pinnedUntilDate);
    setPinnedAfterDate(aLoadable?.pinnedAfterDate);
  }, []);
  if (Object.keys(aInfo).length === 0) {
    loadRecoilAssignmentValues(doenetId);
    return null;
  }
  if (role === "student") {
    let nAttemptsAllowed = aInfo?.numberOfAttemptsAllowed;
    if (nAttemptsAllowed === null) {
      nAttemptsAllowed = "unlimited";
    }
    let timeLimitJSX = null;
    if (aInfo?.timeLimit !== null) {
      timeLimitJSX = /* @__PURE__ */ React.createElement("p", null, "Time Limit: ", aInfo?.timeLimit, " minutes");
    }
    let assignedDateJSX = null;
    if (aInfo?.assignedDate !== null) {
      assignedDateJSX = /* @__PURE__ */ React.createElement("p", null, "Assigned: ", aInfo?.assignedDate);
    }
    let dueDateJSX = /* @__PURE__ */ React.createElement("p", null, "No Due Date");
    if (aInfo?.dueDate !== null) {
      dueDateJSX = /* @__PURE__ */ React.createElement("p", null, "Due: ", aInfo?.dueDate);
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, assignedDateJSX, dueDateJSX, timeLimitJSX, /* @__PURE__ */ React.createElement("p", null, "Attempts Allowed: ", nAttemptsAllowed), /* @__PURE__ */ React.createElement("p", null, "Points: ", aInfo?.totalPointsOrPercent)));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AssignTo, {
    updateAssignment
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Assigned Date"), /* @__PURE__ */ React.createElement(InputControl, {
    onClick: (e) => e.preventDefault()
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checkedIcon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCalendarPlus
    }),
    uncheckedIcon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCalendarTimes
    }),
    checked: assignedDate !== null && assignedDate !== void 0,
    onClick: () => {
      let valueDescription = "None";
      let value = null;
      if (assignedDate === null || assignedDate === void 0) {
        valueDescription = "Now";
        value = DateToDateString(new Date());
      }
      setAssignedDate(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "assignedDate",
        value,
        description: "Assigned Date",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(DateTime, {
    disabled: assignedDate === null || assignedDate === void 0,
    value: assignedDate ? new Date(assignedDate) : null,
    disabledText: "No Assigned Date",
    disabledOnClick: () => {
      let valueDescription = "Now";
      let value = DateToDateString(new Date());
      setAssignedDate(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "assignedDate",
        value,
        description: "Assigned Date",
        valueDescription
      });
    },
    onBlur: ({valid, value}) => {
      if (valid) {
        try {
          value = value.toDate();
        } catch (e) {
        }
        if (new Date(DateToDateString(value)).getTime() !== new Date(assignedDate).getTime()) {
          setAssignedDate(DateToDateString(value));
          updateAssignment({
            doenetId,
            keyToUpdate: "assignedDate",
            value: DateToDateString(value),
            description: "Assigned Date"
          });
        }
      } else {
        addToast("Invalid Assigned Date");
      }
    }
  }))), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Due Date"), /* @__PURE__ */ React.createElement(InputControl, {
    onClick: (e) => e.preventDefault()
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checkedIcon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCalendarPlus
    }),
    uncheckedIcon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCalendarTimes
    }),
    checked: dueDate !== null && dueDate !== void 0,
    onClick: () => {
      let valueDescription = "None";
      let value = null;
      if (dueDate === null || dueDate === void 0) {
        valueDescription = "Next Week";
        let nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        value = DateToDateString(nextWeek);
      }
      setDueDate(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "dueDate",
        value,
        description: "Due Date",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(DateTime, {
    disabled: dueDate === null || dueDate === void 0,
    value: dueDate ? new Date(dueDate) : null,
    onBlur: ({valid, value}) => {
      if (valid) {
        try {
          value = value.toDate();
        } catch (e) {
        }
        if (new Date(DateToDateString(value)).getTime() !== new Date(dueDate).getTime()) {
          setDueDate(DateToDateString(value));
          updateAssignment({
            doenetId,
            keyToUpdate: "dueDate",
            value: DateToDateString(value),
            description: "Due Date"
          });
        }
      } else {
        addToast("Invalid Due Date");
      }
    },
    disabledText: "No Due Date",
    disabledOnClick: () => {
      let valueDescription = "Next Week";
      let nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      let value = DateToDateString(nextWeek);
      setDueDate(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "dueDate",
        value,
        description: "Due Date",
        valueDescription
      });
    }
  }))), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Time Limit"), /* @__PURE__ */ React.createElement(InputControl, {
    onClick: (e) => e.preventDefault()
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: timeLimit !== null,
    onClick: () => {
      let valueDescription = "Not Limited";
      let value = null;
      if (timeLimit === null) {
        valueDescription = "60 Minutes";
        value = 60;
      }
      setTimeLimit(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "timeLimit",
        value,
        description: "Time Limit ",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(Increment, {
    disabled: timeLimit === null,
    value: timeLimit,
    min: 0,
    onBlur: () => {
      if (aInfo.timeLimit !== timeLimit) {
        let timelimitlocal = null;
        if (timeLimit < 0 || timeLimit === "" || isNaN(timeLimit)) {
          setTimeLimit(0);
          timelimitlocal = 0;
        } else {
          timelimitlocal = parseInt(timeLimit);
          setTimeLimit(parseInt(timeLimit));
        }
        let valueDescription = `${timelimitlocal} Minutes`;
        updateAssignment({
          doenetId,
          keyToUpdate: "timeLimit",
          value: timelimitlocal,
          description: "Time Limit",
          valueDescription
        });
      }
    },
    onChange: (newValue) => setTimeLimit(newValue)
  }))), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Attempts"), /* @__PURE__ */ React.createElement(InputControl, {
    onClick: (e) => e.preventDefault()
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: limitAttempts !== null,
    onClick: () => {
      let valueDescription = "Not Limited";
      let value = null;
      if (limitAttempts === null) {
        valueDescription = "1";
        value = 1;
      }
      setLimitAttempts(value);
      setNumberOfAttemptsAllowed(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "numberOfAttemptsAllowed",
        value,
        description: "Attempts Allowed ",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(Increment, {
    disabled: limitAttempts === null,
    value: numberOfAttemptsAllowed,
    min: 0,
    onBlur: () => {
      if (aInfo.numberOfAttemptsAllowed !== numberOfAttemptsAllowed) {
        let numberOfAttemptsAllowedLocal = null;
        if (numberOfAttemptsAllowed < 0 || numberOfAttemptsAllowed === "" || isNaN(numberOfAttemptsAllowed)) {
          setNumberOfAttemptsAllowed(0);
          numberOfAttemptsAllowedLocal = 0;
        } else {
          numberOfAttemptsAllowedLocal = parseInt(numberOfAttemptsAllowed);
          setNumberOfAttemptsAllowed(parseInt(numberOfAttemptsAllowed));
        }
        updateAssignment({
          doenetId,
          keyToUpdate: "numberOfAttemptsAllowed",
          value: numberOfAttemptsAllowedLocal,
          description: "Attempts Allowed"
        });
      }
    },
    onChange: (newValue) => setNumberOfAttemptsAllowed(newValue)
  }))), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Attempt Aggregation"), /* @__PURE__ */ React.createElement(InputControl, null, /* @__PURE__ */ React.createElement(DropdownMenu, {
    width: "menu",
    valueIndex: attemptAggregation === "m" ? 1 : 2,
    items: [
      ["m", "Maximum"],
      ["l", "Last Attempt"]
    ],
    onChange: ({value: val}) => {
      let valueDescription = "Maximum";
      if (val === "l") {
        valueDescription = "Last Attempt";
      }
      setAttemptAggregation(val);
      updateAssignment({
        doenetId,
        keyToUpdate: "attemptAggregation",
        value: val,
        description: "Attempt Aggregation",
        valueDescription
      });
    }
  }))), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Total Points Or Percent"), /* @__PURE__ */ React.createElement(InputControl, null, /* @__PURE__ */ React.createElement(Increment, {
    value: totalPointsOrPercent,
    min: 0,
    onBlur: () => {
      if (aInfo.totalPointsOrPercent !== totalPointsOrPercent) {
        let totalPointsOrPercentLocal = null;
        if (totalPointsOrPercent < 0 || totalPointsOrPercent === "" || isNaN(totalPointsOrPercent)) {
          setTotalPointsOrPercent(0);
          totalPointsOrPercentLocal = 0;
        } else {
          totalPointsOrPercentLocal = parseInt(totalPointsOrPercent);
          setTotalPointsOrPercent(parseInt(totalPointsOrPercent));
        }
        updateAssignment({
          doenetId,
          keyToUpdate: "totalPointsOrPercent",
          value: totalPointsOrPercentLocal,
          description: "Total Points Or Percent"
        });
      }
    },
    onChange: (newValue) => setTotalPointsOrPercent(newValue)
  }))), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Grade Category"), /* @__PURE__ */ React.createElement(DropdownMenu, {
    valueIndex: {
      gateway: 1,
      exams: 2,
      quizzes: 3,
      "problem sets": 4,
      projects: 5,
      participation: 6
    }[gradeCategory],
    items: [
      ["gateway", "Gateway"],
      ["exams", "Exams"],
      ["quizzes", "Quizzes"],
      ["problem sets", "Problem Sets"],
      ["projects", "Projects"],
      ["participation", "Participation"]
    ],
    onChange: ({value: val}) => {
      console.log("on change");
      if (aInfo.gradeCategory !== val) {
        aInfoRef.current.gradeCategory = val;
        setGradeCategory(val);
        updateAssignment({
          doenetId,
          keyToUpdate: "gradeCategory",
          value: val,
          description: "Grade Category"
        });
      }
    }
  })), /* @__PURE__ */ React.createElement("div", {
    style: {margin: "16px 0"}
  }, /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement("div", {
    onClick: (e) => e.preventDefault()
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: individualize,
    onClick: () => {
      let valueDescription = "False";
      let value = false;
      if (!individualize) {
        valueDescription = "True";
        value = true;
      }
      setIndividualize(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "individualize",
        value,
        description: "Individualize",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, "Individualize"))), /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement("div", {
    onClick: (e) => e.preventDefault()
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: showSolution,
    onClick: () => {
      let valueDescription = "False";
      let value = false;
      if (!showSolution) {
        valueDescription = "True";
        value = true;
      }
      setShowSolution(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "showSolution",
        value,
        description: "Show Solution",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, "Show Solution"))), /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: showSolutionInGradebook,
    onClick: () => {
      let valueDescription = "False";
      let value = false;
      if (!showSolutionInGradebook) {
        valueDescription = "True";
        value = true;
      }
      setShowSolutionInGradebook(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "showSolutionInGradebook",
        value,
        description: "Show Solution In Gradebook",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, "Show Solution In Gradebook")), /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: showFeedback,
    onClick: () => {
      let valueDescription = "False";
      let value = false;
      if (!showFeedback) {
        valueDescription = "True";
        value = true;
      }
      setShowFeedback(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "showFeedback",
        value,
        description: "Show Feedback",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, "Show Feedback")), /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: showHints,
    onClick: () => {
      let valueDescription = "False";
      let value = false;
      if (!showHints) {
        valueDescription = "True";
        value = true;
      }
      setShowHints(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "showHints",
        value,
        description: "Show Hints",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, "Show Hints")), /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: showCorrectness,
    onClick: () => {
      let valueDescription = "False";
      let value = false;
      if (!showCorrectness) {
        valueDescription = "True";
        value = true;
      }
      setShowCorrectness(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "showCorrectness",
        value,
        description: "Show Correctness",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, "Show Correctness")), /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: showCreditAchievedMenu,
    onClick: () => {
      let valueDescription = "False";
      let value = false;
      if (!showCreditAchievedMenu) {
        valueDescription = "True";
        value = true;
      }
      setShowCreditAchievedMenu(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "showCreditAchievedMenu",
        value,
        description: "Show Credit Achieved Menu",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, "Show Credit Achieved Menu")), /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: proctorMakesAvailable,
    onClick: () => {
      let valueDescription = "False";
      let value = false;
      if (!proctorMakesAvailable) {
        valueDescription = "True";
        value = true;
      }
      setProctorMakesAvailable(value);
      updateAssignment({
        doenetId,
        keyToUpdate: "proctorMakesAvailable",
        value,
        description: "Proctor Makes Available",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, "Proctor Makes Available"))), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Pin Assignment"), /* @__PURE__ */ React.createElement(InputControl, {
    onClick: (e) => e.preventDefault()
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checkedIcon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCalendarPlus
    }),
    uncheckedIcon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCalendarTimes
    }),
    checked: pinnedUntilDate !== null && pinnedUntilDate !== void 0,
    onClick: () => {
      let valueDescription = "None";
      let value = null;
      let secondValue = null;
      if (pinnedUntilDate === null || pinnedUntilDate === void 0) {
        valueDescription = "Now to Next Year";
        let today = new Date();
        let nextYear = new Date();
        nextYear.setDate(nextYear.getDate() + 365);
        value = DateToDateString(today);
        secondValue = DateToDateString(nextYear);
      }
      setPinnedAfterDate(value);
      setPinnedUntilDate(secondValue);
      updateAssignment({
        doenetId,
        keyToUpdate: "pinnedAfterDate",
        value,
        description: "Pinned Dates ",
        valueDescription,
        secondKeyToUpdate: "pinnedUntilDate",
        secondValue
      });
    }
  }), /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", flexDirection: "column"}
  }, /* @__PURE__ */ React.createElement(DateTime, {
    disabled: pinnedAfterDate === null || pinnedAfterDate === void 0,
    disabledText: "No Pinned After Date",
    disabledOnClick: () => {
      let valueDescription = "None";
      let value = null;
      let secondValue = null;
      if (pinnedAfterDate === null || pinnedAfterDate === void 0) {
        valueDescription = "Now to Next Year";
        let today = new Date();
        let nextYear = new Date();
        nextYear.setDate(nextYear.getDate() + 365);
        value = DateToDateString(today);
        secondValue = DateToDateString(nextYear);
      }
      setPinnedAfterDate(value);
      setPinnedUntilDate(secondValue);
      updateAssignment({
        doenetId,
        keyToUpdate: "pinnedAfterDate",
        value,
        description: "Pinned Dates ",
        valueDescription,
        secondKeyToUpdate: "pinnedUntilDate",
        secondValue
      });
    },
    value: pinnedAfterDate ? new Date(pinnedAfterDate) : null,
    onBlur: ({valid, value}) => {
      if (valid) {
        try {
          value = value.toDate();
        } catch (e) {
        }
        if (new Date(DateToDateString(value)).getTime() !== new Date(pinnedAfterDate).getTime()) {
          setPinnedAfterDate(DateToDateString(value));
          updateAssignment({
            doenetId,
            keyToUpdate: "pinnedAfterDate",
            value: DateToDateString(value),
            description: "Pinned After Date"
          });
        }
      } else {
        addToast("Invalid Pin After Date");
      }
    }
  }), /* @__PURE__ */ React.createElement(DateTime, {
    style: {marginTop: "5px"},
    disabled: pinnedUntilDate === null || pinnedUntilDate === void 0,
    disabledText: "No Pinned Until Date",
    disabledOnClick: () => {
      let valueDescription = "None";
      let value = null;
      let secondValue = null;
      if (pinnedUntilDate === null || pinnedUntilDate === void 0) {
        valueDescription = "Now to Next Year";
        let today = new Date();
        let nextYear = new Date();
        nextYear.setDate(nextYear.getDate() + 365);
        value = DateToDateString(today);
        secondValue = DateToDateString(nextYear);
      }
      setPinnedAfterDate(value);
      setPinnedUntilDate(secondValue);
      updateAssignment({
        doenetId,
        keyToUpdate: "pinnedAfterDate",
        value,
        description: "Pinned Dates ",
        valueDescription,
        secondKeyToUpdate: "pinnedUntilDate",
        secondValue
      });
    },
    value: pinnedUntilDate ? new Date(pinnedUntilDate) : null,
    onBlur: ({valid, value}) => {
      if (valid) {
        try {
          value = value.toDate();
        } catch (e) {
        }
        if (new Date(DateToDateString(value)).getTime() !== new Date(pinnedUntilDate).getTime()) {
          setPinnedUntilDate(DateToDateString(value));
          updateAssignment({
            doenetId,
            keyToUpdate: "pinnedUntilDate",
            value: DateToDateString(value),
            description: "Pinned Until Date"
          });
        }
      } else {
        addToast("Invalid Pin Until Date");
      }
    }
  })))));
}
