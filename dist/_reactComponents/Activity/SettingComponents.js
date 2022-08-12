import {
  faCalendarPlus,
  faCalendarTimes
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {DateToDateString} from "../../_utils/dateUtilityFunction.js";
import DateTime from "../PanelHeaderComponents/DateTime.js";
import {useActivity} from "./ActivityActions.js";
import Checkbox from "../PanelHeaderComponents/Checkbox.js";
import Increment from "../PanelHeaderComponents/IncrementMenu.js";
import DropdownMenu from "../PanelHeaderComponents/DropdownMenu.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {
  peopleByCourseId,
  itemByDoenetId,
  useCourse
} from "../Course/CourseActions.js";
import axios from "../../_snowpack/pkg/axios.js";
import RelatedItems from "../PanelHeaderComponents/RelatedItems.js";
import ActionButtonGroup from "../PanelHeaderComponents/ActionButtonGroup.js";
import ActionButton from "../PanelHeaderComponents/ActionButton.js";
import {toastType, useToast} from "../../_framework/Toast.js";
import {searchParamAtomFamily} from "../../_framework/NewToolRoot.js";
import {useSaveDraft} from "../../_framework/ToolPanels/DoenetMLEditor.js";
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
export const AssignUnassignActivity = ({doenetId, courseId}) => {
  const pageId = useRecoilValue(searchParamAtomFamily("pageId"));
  const {saveDraft} = useSaveDraft();
  const {compileActivity, updateAssignItem} = useCourse(courseId);
  const {isAssigned} = useRecoilValue(itemByDoenetId(doenetId));
  const addToast = useToast();
  let assignActivityText = "Assign Activity";
  if (isAssigned) {
    assignActivityText = "Update Assigned Activity";
  }
  return /* @__PURE__ */ React.createElement(ActionButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    "data-test": "Assign Activity",
    value: assignActivityText,
    onClick: async () => {
      if (pageId) {
        await saveDraft({pageId, courseId});
      }
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
    "data-test": "Unassign Activity",
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
  }) : null);
};
export const AssignedDate = ({doenetId, courseId, editable = false}) => {
  const addToast = useToast();
  const {
    value: {assignedDate: recoilValue},
    updateAssignmentSettings
  } = useActivity(courseId, doenetId);
  const [assignedDate, setAssignedDate] = useState(recoilValue);
  useEffect(() => {
    setAssignedDate(recoilValue);
  }, [recoilValue]);
  return /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Assigned Date"), /* @__PURE__ */ React.createElement(InputControl, {
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
      updateAssignmentSettings({
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
      updateAssignmentSettings({
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
          updateAssignmentSettings(doenetId, {
            keyToUpdate: "assignedDate",
            value: DateToDateString(value),
            description: "Assigned Date"
          });
        }
      } else {
        addToast("Invalid Assigned Date");
      }
    }
  })));
};
export const DueDate = ({courseId, doenetId}) => {
  const addToast = useToast();
  const {
    value: {dueDate: recoilValue},
    updateAssignmentSettings
  } = useActivity(courseId, doenetId);
  const [dueDate, setDueDate] = useState();
  useEffect(() => {
    setDueDate(recoilValue);
  }, [recoilValue]);
  return /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Due Date"), /* @__PURE__ */ React.createElement(InputControl, {
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
      updateAssignmentSettings({
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
          updateAssignmentSettings({
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
      updateAssignmentSettings({
        keyToUpdate: "dueDate",
        value,
        description: "Due Date",
        valueDescription
      });
    }
  })));
};
export const TimeLimit = ({courseId, doenetId}) => {
  const {
    value: {timeLimit: recoilValue},
    updateAssignmentSettings
  } = useActivity(courseId, doenetId);
  const [timeLimit, setTimeLimit] = useState();
  useEffect(() => {
    setTimeLimit(recoilValue);
  }, [recoilValue]);
  return /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Time Limit in Minutes"), /* @__PURE__ */ React.createElement(InputControl, {
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
      updateAssignmentSettings({
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
      if (recoilValue !== timeLimit) {
        let timelimitlocal = null;
        if (timeLimit < 0 || timeLimit === "" || isNaN(timeLimit)) {
          setTimeLimit(0);
          timelimitlocal = 0;
        } else {
          timelimitlocal = parseInt(timeLimit);
          setTimeLimit(parseInt(timeLimit));
        }
        let valueDescription = `${timelimitlocal} Minutes`;
        updateAssignmentSettings({
          keyToUpdate: "timeLimit",
          value: timelimitlocal,
          description: "Time Limit",
          valueDescription
        });
      }
    },
    onChange: (newValue) => setTimeLimit(newValue)
  })));
};
export const AttempLimit = ({courseId, doenetId}) => {
  const {
    value: {numberOfAttemptsAllowed: recoilValue},
    updateAssignmentSettings
  } = useActivity(courseId, doenetId);
  const [numberOfAttemptsAllowed, setNumberOfAttemptsAllowed] = useState(recoilValue);
  useEffect(() => {
    setNumberOfAttemptsAllowed(recoilValue);
  }, [recoilValue]);
  return /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Attempts"), /* @__PURE__ */ React.createElement(InputControl, {
    onClick: (e) => e.preventDefault()
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: numberOfAttemptsAllowed !== null,
    onClick: () => {
      let valueDescription = "Not Limited";
      let value = null;
      if (numberOfAttemptsAllowed === null) {
        valueDescription = "1";
        value = 1;
      }
      setNumberOfAttemptsAllowed(value);
      updateAssignmentSettings({
        keyToUpdate: "numberOfAttemptsAllowed",
        value,
        description: "Attempts Allowe",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(Increment, {
    disabled: numberOfAttemptsAllowed === null,
    value: numberOfAttemptsAllowed,
    min: 0,
    onBlur: () => {
      if (recoilValue !== numberOfAttemptsAllowed) {
        let numberOfAttemptsAllowedLocal = 1;
        if (numberOfAttemptsAllowed <= 0 || numberOfAttemptsAllowed === "" || isNaN(numberOfAttemptsAllowed)) {
          setNumberOfAttemptsAllowed(numberOfAttemptsAllowedLocal);
        } else {
          numberOfAttemptsAllowedLocal = parseInt(numberOfAttemptsAllowed);
          setNumberOfAttemptsAllowed(numberOfAttemptsAllowedLocal);
        }
        updateAssignmentSettings({
          keyToUpdate: "numberOfAttemptsAllowed",
          value: numberOfAttemptsAllowedLocal,
          description: "Attempts Allowed"
        });
      }
    },
    onChange: (newValue) => setNumberOfAttemptsAllowed(newValue)
  })));
};
export const AttemptAggregation = ({courseId, doenetId}) => {
  const {
    value: {attemptAggregation: recoilValue},
    updateAssignmentSettings
  } = useActivity(courseId, doenetId);
  const [attemptAggregation, setAttemptAggregation] = useState();
  useEffect(() => {
    setAttemptAggregation(recoilValue);
  }, [recoilValue]);
  return /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Attempt Aggregation"), /* @__PURE__ */ React.createElement(InputControl, null, /* @__PURE__ */ React.createElement(DropdownMenu, {
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
      updateAssignmentSettings({
        keyToUpdate: "attemptAggregation",
        value: val,
        description: "Attempt Aggregation",
        valueDescription
      });
    }
  })));
};
export const TotalPointsOrPercent = ({courseId, doenetId}) => {
  const {
    value: {totalPointsOrPercent: recoilValue},
    updateAssignmentSettings
  } = useActivity(courseId, doenetId);
  const [totalPointsOrPercent, setTotalPointsOrPercent] = useState();
  useEffect(() => {
    setTotalPointsOrPercent(recoilValue);
  }, [recoilValue]);
  return /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Total Points Or Percent"), /* @__PURE__ */ React.createElement(InputControl, null, /* @__PURE__ */ React.createElement(Increment, {
    value: totalPointsOrPercent,
    min: 0,
    onBlur: () => {
      if (recoilValue !== totalPointsOrPercent) {
        let totalPointsOrPercentLocal = null;
        if (totalPointsOrPercent < 0 || totalPointsOrPercent === "" || isNaN(totalPointsOrPercent)) {
          setTotalPointsOrPercent(0);
          totalPointsOrPercentLocal = 0;
        } else {
          totalPointsOrPercentLocal = parseInt(totalPointsOrPercent);
          setTotalPointsOrPercent(parseInt(totalPointsOrPercent));
        }
        updateAssignmentSettings(doenetId, {
          keyToUpdate: "totalPointsOrPercent",
          value: totalPointsOrPercentLocal,
          description: "Total Points Or Percent"
        });
      }
    },
    onChange: (newValue) => setTotalPointsOrPercent(newValue)
  })));
};
export const GradeCategory = ({courseId, doenetId}) => {
  const {
    value: {gradeCategory: recoilValue},
    updateAssignmentSettings
  } = useActivity(courseId, doenetId);
  const [gradeCategory, setGradeCategory] = useState();
  useEffect(() => {
    setGradeCategory(recoilValue);
  }, [recoilValue]);
  return /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Grade Category"), /* @__PURE__ */ React.createElement(DropdownMenu, {
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
      if (recoilValue !== val) {
        setGradeCategory(val);
        updateAssignmentSettings({
          keyToUpdate: "gradeCategory",
          value: val,
          description: "Grade Category"
        });
      }
    }
  }));
};
export const CheckedSetting = ({
  courseId,
  doenetId,
  keyToUpdate,
  description,
  label,
  invert
}) => {
  const {
    value: {[keyToUpdate]: recoilValue},
    updateAssignmentSettings
  } = useActivity(courseId, doenetId);
  const [localValue, setLocalValue] = useState(recoilValue);
  useEffect(() => {
    setLocalValue(recoilValue);
  }, [invert, recoilValue]);
  return /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: invert ? !localValue : localValue,
    onClick: () => {
      let valueDescription = invert ? "True" : "False";
      let value = false;
      if (!localValue) {
        valueDescription = invert ? "False" : "True";
        value = true;
      }
      setLocalValue(value);
      updateAssignmentSettings({
        keyToUpdate,
        value,
        description,
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, label ?? description));
};
export const CheckedFlag = ({
  courseId,
  doenetId,
  keyToUpdate,
  description,
  label,
  invert
}) => {
  const {
    value: {[keyToUpdate]: recoilValue},
    updateActivityFlags
  } = useActivity(courseId, doenetId);
  const [localValue, setLocalValue] = useState(recoilValue);
  useEffect(() => {
    setLocalValue(recoilValue);
  }, [recoilValue, invert]);
  return /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    style: {marginRight: "5px"},
    checked: invert ? !localValue : localValue,
    onClick: () => {
      let valueDescription = invert ? "True" : "False";
      let value = false;
      if (!localValue) {
        valueDescription = invert ? "False" : "True";
        value = true;
      }
      setLocalValue(value);
      updateActivityFlags({
        keyToUpdate,
        value,
        description,
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, label ?? description));
};
export const Individualize = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "individualize",
    description: "Individualize"
  });
};
export const ShowSolution = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showSolution",
    description: "Show Solution"
  });
};
export const ShowSolutionInGradebook = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showSolutionInGradebook",
    description: "Show Solution In Gradebook"
  });
};
export const ShowFeedback = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showFeedback",
    description: "Show Feedback"
  });
};
export const ShowHints = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showHints",
    description: "Show Hints"
  });
};
export const ShowCorrectness = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showCorrectness",
    description: "Show Correctness"
  });
};
export const ShowCreditAchieved = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showCreditAchievedMenu",
    description: "Show Credit Achieved Menu"
  });
};
export const MakePublic = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedFlag, {
    courseId,
    doenetId,
    keyToUpdate: "isPublic",
    description: "Make Publicly Visible"
  });
};
export const ShowDoenetMLSource = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedFlag, {
    courseId,
    doenetId,
    keyToUpdate: "userCanViewSource",
    description: "Show DoenetML Source"
  });
};
export const ProctorMakesAvailable = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "proctorMakesAvailable",
    description: "Proctor Makes Available"
  });
};
export const PinAssignment = ({courseId, doenetId}) => {
  const addToast = useToast();
  const {
    value: {
      pinnedUntilDate: recoilPinnedUntilDate,
      pinnedAfterDate: recoilPinnedAfterDate
    },
    updateAssignmentSettings
  } = useActivity(courseId, doenetId);
  const [pinnedUntilDate, setPinnedUntilDate] = useState(recoilPinnedUntilDate);
  const [pinnedAfterDate, setPinnedAfterDate] = useState(recoilPinnedAfterDate);
  useEffect(() => {
    setPinnedUntilDate(recoilPinnedUntilDate);
  }, [recoilPinnedUntilDate]);
  useEffect(() => {
    setPinnedAfterDate(recoilPinnedAfterDate);
  }, [recoilPinnedAfterDate]);
  return /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Pin Assignment"), /* @__PURE__ */ React.createElement(InputControl, {
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
      updateAssignmentSettings({
        keyToUpdate: "pinnedAfterDate",
        value,
        description: "Pinned Dates ",
        valueDescription
      }, {
        keyToUpdate: "pinnedUntilDate",
        value: secondValue
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
      updateAssignmentSettings({
        keyToUpdate: "pinnedAfterDate",
        value,
        description: "Pinned Dates ",
        valueDescription
      }, {
        keyToUpdate: "pinnedUntilDate",
        value: secondValue
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
          updateAssignmentSettings({
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
      updateAssignmentSettings({
        keyToUpdate: "pinnedAfterDate",
        value,
        description: "Pinned Dates ",
        valueDescription
      }, {
        keyToUpdate: "pinnedUntilDate",
        value: secondValue
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
          updateAssignmentSettings({
            keyToUpdate: "pinnedUntilDate",
            value: DateToDateString(value),
            description: "Pinned Until Date"
          });
        }
      } else {
        addToast("Invalid Pin Until Date");
      }
    }
  }))));
};
export function AssignTo({courseId, doenetId}) {
  const {
    value: {isGloballyAssigned}
  } = useActivity(courseId, doenetId);
  const {value: enrolledStudents} = useRecoilValue(peopleByCourseId(courseId));
  const [restrictedTo, setRestrictedTo] = useState([]);
  async function getAndSetRestrictedTo({courseId: courseId2, doenetId: doenetId2}) {
    let resp = await axios.get("/api/getRestrictedTo.php", {
      params: {courseId: courseId2, doenetId: doenetId2}
    });
    setRestrictedTo(resp.data.restrictedTo);
  }
  async function updateRestrictedTo({courseId: courseId2, doenetId: doenetId2, emailAddresses}) {
    let resp = await axios.post("/api/updateRestrictedTo.php", {
      courseId: courseId2,
      doenetId: doenetId2,
      emailAddresses
    });
    if (resp.data.success) {
      setRestrictedTo(emailAddresses);
    }
  }
  useEffect(() => {
    if (!isGloballyAssigned) {
      getAndSetRestrictedTo({courseId, doenetId});
    }
  }, [courseId, doenetId, isGloballyAssigned]);
  let enrolledJSX = enrolledStudents.reduce((allrows, row) => {
    if (row.withdrew == "0") {
      if (!isGloballyAssigned && restrictedTo.includes(row.email)) {
        return [
          ...allrows,
          /* @__PURE__ */ React.createElement("option", {
            selected: true,
            key: `enrolledOpt${row.email}`,
            value: row.email
          }, row.firstName, " ", row.lastName)
        ];
      } else {
        return [
          ...allrows,
          /* @__PURE__ */ React.createElement("option", {
            key: `enrolledOpt${row.email}`,
            value: row.email
          }, row.firstName, " ", row.lastName)
        ];
      }
    } else {
      return allrows;
    }
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CheckedFlag, {
    courseId,
    doenetId,
    keyToUpdate: "isGloballyAssigned",
    description: "Restrict Assignment",
    invert: true
  }), /* @__PURE__ */ React.createElement(RelatedItems, {
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
