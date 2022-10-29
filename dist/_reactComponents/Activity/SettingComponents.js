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
import {atomFamily, useRecoilState, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
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
import {prerenderActivity} from "../../_utils/activtyWebWorker.js";
import Textfield from "../PanelHeaderComponents/Textfield.js";
import {useSaveDraft} from "../../_utils/hooks/useSaveDraft.js";
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
const initializingWorkersAtom = atomFamily({
  key: "initializingWorkersAtom",
  default: null
});
export const AssignUnassignActivity = ({doenetId, courseId}) => {
  const pageId = useRecoilValue(searchParamAtomFamily("pageId"));
  const {saveDraft} = useSaveDraft();
  const {compileActivity, updateAssignItem} = useCourse(courseId);
  const itemObj = useRecoilValue(itemByDoenetId(doenetId));
  const isAssigned = itemObj.isAssigned;
  const addToast = useToast();
  const [initializeStatus, setInitializeStatus] = useState("");
  let assignActivityText = "Assign Activity";
  let assignActivityToast = "Activity Assigned";
  if (isAssigned) {
    assignActivityText = "Update Assigned Activity";
    assignActivityToast = "Assigned Activity Updated";
  }
  let [initializingWorker, setInitializingWorker] = useRecoilState(initializingWorkersAtom(doenetId));
  let assignButton = /* @__PURE__ */ React.createElement(ActionButton, {
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
          addToast(assignActivityToast, toastType.INFO);
        }
      });
    }
  });
  let unAssignButton = null;
  let prerenderButton = null;
  if (isAssigned) {
    unAssignButton = /* @__PURE__ */ React.createElement(ActionButton, {
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
    });
    if (initializingWorker) {
      prerenderButton = /* @__PURE__ */ React.createElement(ActionButton, {
        width: "menu",
        "data-test": "Cancel prerendering",
        value: `${initializeStatus} (Cancel)`,
        onClick: () => {
          initializingWorker.terminate();
          setInitializingWorker(null);
        }
      });
    } else {
      let initializePrerender = async () => {
        let flags = {
          showCorrectness: itemObj.showCorrectness,
          readOnly: false,
          solutionDisplayMode: itemObj.showSolution ? "button" : "none",
          showFeedback: itemObj.showFeedback,
          showHints: itemObj.showHints,
          allowLoadState: false,
          allowSaveState: false,
          allowLocalState: false,
          allowSaveSubmissions: false,
          allowSaveEvents: false
        };
        let resp = await axios.get(`/api/getCidForAssignment.php`, {params: {doenetId}});
        if (resp.data.cid) {
          setInitializeStatus("");
          let worker = prerenderActivity({cid: resp.data.cid, doenetId, flags});
          setInitializingWorker(worker);
          worker.onmessage = (e) => {
            if (e.data.messageType === "status") {
              setInitializeStatus(`${e.data.stage} ${Math.round(e.data.complete * 100)}%`);
            } else {
              worker.terminate();
              setInitializingWorker(null);
            }
          };
        }
      };
      prerenderButton = /* @__PURE__ */ React.createElement(ActionButton, {
        width: "menu",
        "data-test": "Prerender activity",
        value: "Prerender activity",
        onClick: initializePrerender
      });
    }
  }
  return /* @__PURE__ */ React.createElement(ActionButtonGroup, {
    vertical: true
  }, assignButton, unAssignButton, prerenderButton);
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
    dataTest: "Assigned Date Checkbox",
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
    dataTest: "Assigned Date",
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
    dataTest: "Due Date Checkbox",
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
    dataTest: "Due Date",
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
    dataTest: "Time Limit Checkbox",
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
    dataTest: "Time Limit",
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
export const AttemptLimit = ({courseId, doenetId}) => {
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
    dataTest: "Attempt Limit Checkbox",
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
        description: "Attempts Allowed",
        valueDescription
      });
    }
  }), /* @__PURE__ */ React.createElement(Increment, {
    disabled: numberOfAttemptsAllowed === null,
    value: numberOfAttemptsAllowed,
    dataTest: "Attempt Limit",
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
    dataTest: "Attempt Aggregation",
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
    dataTest: "Total Points Or Percent",
    min: 0,
    onBlur: () => {
      if (recoilValue !== totalPointsOrPercent) {
        let totalPointsOrPercentLocal = null;
        if (totalPointsOrPercent < 0 || totalPointsOrPercent === "" || isNaN(totalPointsOrPercent)) {
          setTotalPointsOrPercent(0);
          totalPointsOrPercentLocal = 0;
        } else {
          totalPointsOrPercentLocal = parseFloat(totalPointsOrPercent);
          setTotalPointsOrPercent(parseFloat(totalPointsOrPercent));
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
    defaultIndex: "7",
    valueIndex: {
      gateway: 1,
      exams: 2,
      quizzes: 3,
      "problem sets": 4,
      projects: 5,
      participation: 6,
      "No Category": 7
    }[gradeCategory],
    items: [
      ["gateway", "Gateway"],
      ["exams", "Exams"],
      ["quizzes", "Quizzes"],
      ["problem sets", "Problem Sets"],
      ["projects", "Projects"],
      ["participation", "Participation"],
      ["NULL", "No Category"]
    ],
    dataTest: "Grade Category",
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
export const ItemWeights = ({courseId, doenetId}) => {
  const {
    value: {itemWeights: recoilValue},
    updateAssignmentSettings
  } = useActivity(courseId, doenetId);
  const [textValue, setTextValue] = useState("");
  useEffect(() => {
    setTextValue(recoilValue?.join(" "));
  }, [recoilValue]);
  return /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(LabelText, null, "Item Weights"), /* @__PURE__ */ React.createElement(Textfield, {
    vertical: true,
    width: "menu",
    value: textValue,
    "data-test": "Item Weights",
    onChange: (e) => {
      setTextValue(e.target.value);
    },
    onBlur: () => {
      let parsedValue = textValue.split(" ").filter((x) => x).map(Number).map((x) => x >= 0 ? x : 0);
      if (recoilValue.length !== parsedValue.length || recoilValue.some((v, i) => v !== parsedValue[i])) {
        updateAssignmentSettings({
          keyToUpdate: "itemWeights",
          value: parsedValue,
          description: "Item Weights"
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
  invert,
  dataTest
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
    dataTest,
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
  invert,
  dataTest
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
    dataTest,
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
    description: "Individualize",
    dataTest: "Individualize"
  });
};
export const ShowSolution = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showSolution",
    description: "Show Solution",
    dataTest: "Show Solution"
  });
};
export const ShowSolutionInGradebook = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showSolutionInGradebook",
    description: "Show Solution In Gradebook",
    dataTest: "Show Solution In Gradebook"
  });
};
export const ShowFeedback = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showFeedback",
    description: "Show Feedback",
    dataTest: "Show Feedback"
  });
};
export const ShowHints = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showHints",
    description: "Show Hints",
    dataTest: "Show Hints"
  });
};
export const ShowCorrectness = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showCorrectness",
    description: "Show Correctness",
    dataTest: "Show Correctness"
  });
};
export const ShowCreditAchieved = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showCreditAchievedMenu",
    description: "Show Credit Achieved Menu",
    dataTest: "Show Credit Achieved Menu"
  });
};
export const Paginate = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "paginate",
    description: "Paginate",
    dataTest: "Paginate"
  });
};
export const ShowFinishButton = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "showFinishButton",
    description: "Show Finish Button",
    dataTest: "Show Finish Button"
  });
};
export const MakePublic = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedFlag, {
    courseId,
    doenetId,
    keyToUpdate: "isPublic",
    description: "Make Publicly Visible",
    dataTest: "Make Publicly Visible"
  });
};
export const ShowDoenetMLSource = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedFlag, {
    courseId,
    doenetId,
    keyToUpdate: "userCanViewSource",
    description: "Show DoenetML Source",
    dataTest: "Show DoenetML Source"
  });
};
export const CanViewAfterCompleted = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "canViewAfterCompleted",
    description: "Can View After Completed",
    dataTest: "Can View After Completed"
  });
};
export const ProctorMakesAvailable = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "proctorMakesAvailable",
    description: "Proctor Makes Available",
    dataTest: "Proctor Makes Available"
  });
};
export const AutoSubmit = ({courseId, doenetId}) => {
  return /* @__PURE__ */ React.createElement(CheckedSetting, {
    courseId,
    doenetId,
    keyToUpdate: "autoSubmit",
    description: "Auto Submit",
    dataTest: "Auto Submit"
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
    dataTest: "Pin Assignment Checkbox",
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
    dataTest: "Pinned After Date",
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
    dataTest: "Pinned Until Date",
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
