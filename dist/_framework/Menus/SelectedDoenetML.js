import {faCode} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import DropdownMenu from "../../_reactComponents/PanelHeaderComponents/DropdownMenu.js";
import DateTime from "../../_reactComponents/PanelHeaderComponents/DateTime.js";
import {
  DateToUTCDateString,
  DateToDateString
} from "../../_utils/dateUtilityFunction.js";
import Increment from "../../_reactComponents/PanelHeaderComponents/IncrementMenu.js";
import {
  atom,
  selector,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {
  loadAssignmentSelector,
  folderDictionary,
  globalSelectedNodesAtom
} from "../../_reactComponents/Drive/NewDrive.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
import useSockets from "../../_reactComponents/Sockets.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import Switch from "../Switch.js";
import axios from "../../_snowpack/pkg/axios.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import {
  itemHistoryAtom,
  fileByContentId
} from "../ToolHandlers/CourseToolHandler.js";
import {useToast, toastType} from "../Toast.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import CalendarToggle from "../../_reactComponents/PanelHeaderComponents/CalendarToggle.js";
export const selectedVersionAtom = atom({
  key: "selectedVersionAtom",
  default: ""
});
export default function SelectedDoenetML() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const item = useRecoilValue(selectedInformation)[0];
  let [label, setLabel] = useState("");
  const {deleteItem, renameItem} = useSockets("drive");
  const addToast = useToast();
  useEffect(() => {
    setLabel(item?.label);
  }, [item?.label]);
  const assignUnassign = useRecoilCallback(({set, snapshot}) => async ({label: label2, doenetId, parentFolderId, driveId}) => {
    const versionId = nanoid();
    const timestamp = DateToUTCDateString(new Date());
    let itemHistory = await snapshot.getPromise(itemHistoryAtom(doenetId));
    const contentId = itemHistory.draft.contentId;
    let doenetML = await snapshot.getPromise(fileByContentId(contentId));
    const {data} = await axios.post("/api/releaseDraft.php", {
      doenetId,
      doenetML,
      timestamp,
      versionId
    });
    const {success, message, title} = data;
    if (success) {
      addToast(`${label2}'s "${title}" is Released.`, toastType.SUCCESS);
    } else {
      addToast(message, toastType.ERROR);
    }
    set(itemHistoryAtom(doenetId), (was) => {
      let newObj = {...was};
      let newNamed = [...was.named];
      for (const [i, version] of newNamed.entries()) {
        let newVersion2 = {...version};
        newVersion2.isReleased = "0";
        newNamed[i] = newVersion2;
      }
      let newVersion = {
        title,
        versionId,
        timestamp,
        isReleased: "1",
        isDraft: "0",
        isNamed: "1",
        contentId
      };
      newNamed.unshift(newVersion);
      newObj.named = newNamed;
      return newObj;
    });
    set(folderDictionary({driveId, folderId: parentFolderId}), (was) => {
      let newFolderInfo = {...was};
      let itemId = null;
      for (let testItemId of newFolderInfo.contentIds.defaultOrder) {
        if (newFolderInfo.contentsDictionary[testItemId].doenetId === doenetId) {
          itemId = testItemId;
          break;
        }
      }
      newFolderInfo.contentsDictionary = {...was.contentsDictionary};
      newFolderInfo.contentsDictionary[itemId] = {
        ...was.contentsDictionary[itemId]
      };
      newFolderInfo.contentsDictionary[itemId].isReleased = "1";
      newFolderInfo.contentsDictionaryByDoenetId = {
        ...was.contentsDictionaryByDoenetId
      };
      newFolderInfo.contentsDictionaryByDoenetId[doenetId] = {
        ...was.contentsDictionaryByDoenetId[doenetId]
      };
      newFolderInfo.contentsDictionaryByDoenetId[doenetId].isReleased = "1";
      return newFolderInfo;
    });
  });
  if (!item) {
    return null;
  }
  if (effectiveRole === "student") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", {
      "data-cy": "infoPanelItemLabel"
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCode
    }), " ", item?.label), /* @__PURE__ */ React.createElement(ActionButton, {
      width: "menu",
      value: "Take Assignment",
      onClick: () => {
        setPageToolView({
          page: "course",
          tool: "assignment",
          view: "",
          params: {
            doenetId: item?.doenetId
          }
        });
      }
    }), /* @__PURE__ */ React.createElement(AssignmentSettings, {
      role: effectiveRole,
      doenetId: item.doenetId
    }));
  }
  let assignDraftLabel = "Release Current Draft";
  function renameItemCallback(newLabel, item2) {
    renameItem({
      driveIdFolderId: {
        driveId: item2.driveId,
        folderId: item2.parentFolderId
      },
      itemId: item2.itemId,
      itemType: item2.itemType,
      newLabel
    });
  }
  let surveyButton = null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "infoPanelItemLabel"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faCode
  }), " ", item.label), /* @__PURE__ */ React.createElement(ActionButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "Edit DoenetML",
    onClick: () => {
      setPageToolView({
        page: "course",
        tool: "editor",
        view: "",
        params: {
          doenetId: item.doenetId,
          path: `${item.driveId}:${item.parentFolderId}:${item.itemId}:DoenetML`
        }
      });
    }
  }), /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "Take Assignment",
    onClick: () => {
      setPageToolView({
        page: "course",
        tool: "assignment",
        view: "",
        params: {
          doenetId: item.doenetId
        }
      });
    }
  }), surveyButton), /* @__PURE__ */ React.createElement(Textfield, {
    label: "DoenetML Label",
    width: "menu",
    vertical: true,
    "data-cy": "infoPanelItemLabelInput",
    value: label,
    onChange: (e) => setLabel(e.target.value),
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        let effectiveLabel = label;
        if (label === "") {
          effectiveLabel = "Untitled";
          addToast("Label for the doenetML can't be blank.");
          setLabel(effectiveLabel);
        }
        if (item.label !== effectiveLabel) {
          renameItemCallback(effectiveLabel, item);
        }
      }
    },
    onBlur: () => {
      let effectiveLabel = label;
      if (label === "") {
        effectiveLabel = "Untitled";
        addToast("Label for the doenetML can't be blank.");
        setLabel(effectiveLabel);
      }
      if (item.label !== effectiveLabel) {
        renameItemCallback(effectiveLabel, item);
      }
    }
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: assignDraftLabel,
    onClick: () => assignUnassign(item)
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(AssignmentSettings, {
    role: effectiveRole,
    doenetId: item.doenetId
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    alert: true,
    width: "menu",
    "data-cy": "deleteDoenetMLButton",
    value: "Delete DoenetML",
    onClick: () => {
      deleteItem({
        driveIdFolderId: {
          driveId: item.driveId,
          folderId: item.parentFolderId
        },
        itemId: item.itemId,
        driveInstanceId: item.driveInstanceId,
        label: item.label
      });
    }
  }));
}
export function AssignmentSettings({role, doenetId}) {
  const aLoadable = useRecoilValueLoadable(loadAssignmentSelector(doenetId));
  const aInfo = aLoadable.contents;
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
    const oldAInfo = await snapshot.getPromise(loadAssignmentSelector(doenetId2));
    let newAInfo = {...oldAInfo, [keyToUpdate]: value};
    if (secondKeyToUpdate) {
      newAInfo[secondKeyToUpdate] = secondValue;
    }
    set(loadAssignmentSelector(doenetId2), newAInfo);
    let dbAInfo = {...newAInfo};
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
  }, [addToast]);
  useEffect(() => {
    setAssignedDate(aInfo?.assignedDate);
    setDueDate(aInfo?.dueDate);
    setLimitAttempts(aInfo?.numberOfAttemptsAllowed !== null);
    setNumberOfAttemptsAllowed(aInfo?.numberOfAttemptsAllowed);
    setAttemptAggregation(aInfo?.attemptAggregation);
    setTotalPointsOrPercent(aInfo?.totalPointsOrPercent);
    setGradeCategory(aInfo?.gradeCategory);
    setIndividualize(aInfo?.individualize);
    setShowSolution(aInfo?.showSolution);
    setShowSolutionInGradebook(aInfo?.showSolutionInGradebook);
    setShowFeedback(aInfo?.showFeedback);
    setShowHints(aInfo?.showHints);
    setShowCorrectness(aInfo?.showCorrectness);
    setShowCreditAchievedMenu(aInfo?.showCreditAchievedMenu);
    setProctorMakesAvailable(aInfo?.proctorMakesAvailable);
    setTimeLimit(aInfo?.timeLimit);
    setPinnedUntilDate(aInfo?.pinnedUntilDate);
    setPinnedAfterDate(aInfo?.pinnedAfterDate);
  }, [aInfo]);
  if (aLoadable.state === "loading") {
    return null;
  }
  if (aLoadable.state === "hasError") {
    console.error(aLoadable.contents);
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Assigned Date", /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex"},
    onClick: (e) => {
      e.preventDefault();
    }
  }, /* @__PURE__ */ React.createElement(CalendarToggle, {
    checked: aInfo.assignedDate !== null,
    onClick: (e) => {
      let valueDescription = "None";
      let value = null;
      if (aInfo.assignedDate === null) {
        valueDescription = "Now";
        value = DateToDateString(new Date());
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "assignedDate",
        value,
        description: "Assigned Date",
        valueDescription
      });
    }
  }), aInfo.assignedDate !== null ? /* @__PURE__ */ React.createElement(DateTime, {
    value: aInfo.assignedDate ? new Date(aInfo.assignedDate) : null,
    onBlur: ({valid, value}) => {
      if (valid) {
        try {
          value = value.toDate();
        } catch (e) {
        }
        if (new Date(DateToDateString(value)).getTime() !== new Date(aInfo.assignedDate).getTime()) {
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
  }) : /* @__PURE__ */ React.createElement("input", {
    value: "No Assigned Date",
    onClick: (e) => {
      let valueDescription = "None";
      let value = null;
      if (aInfo.assignedDate === null) {
        valueDescription = "Now";
        value = DateToDateString(new Date());
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "assignedDate",
        value,
        description: "Assigned Date",
        valueDescription
      });
    },
    style: {
      color: "#545454",
      height: "18px",
      width: "177px",
      border: "2px solid black",
      borderRadius: "5px"
    }
  })))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Due Date", /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex"},
    onClick: (e) => {
      e.preventDefault();
    }
  }, /* @__PURE__ */ React.createElement(CalendarToggle, {
    checked: aInfo.dueDate !== null,
    onClick: (e) => {
      let valueDescription = "None";
      let value = null;
      if (aInfo.dueDate === null) {
        valueDescription = "Next Week";
        let nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        value = DateToDateString(nextWeek);
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "dueDate",
        value,
        description: "Due Date",
        valueDescription
      });
    }
  }), aInfo.dueDate !== null ? /* @__PURE__ */ React.createElement(DateTime, {
    value: aInfo.dueDate ? new Date(aInfo.dueDate) : null,
    onBlur: ({valid, value}) => {
      if (valid) {
        try {
          value = value.toDate();
        } catch (e) {
        }
        if (new Date(DateToDateString(value)).getTime() !== new Date(aInfo.dueDate).getTime()) {
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
    }
  }) : /* @__PURE__ */ React.createElement("input", {
    onClick: (e) => {
      let valueDescription = "None";
      let value = null;
      if (aInfo.dueDate === null) {
        valueDescription = "Next Week";
        let nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        value = DateToDateString(nextWeek);
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "dueDate",
        value,
        description: "Due Date",
        valueDescription
      });
    },
    value: "No Due Date",
    style: {
      color: "#545454",
      height: "18px",
      width: "177px",
      border: "2px solid black",
      borderRadius: "5px"
    }
  })))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Time Limit", /* @__PURE__ */ React.createElement(Switch, {
    onChange: (e) => {
      let valueDescription = "Not Limited";
      let value = null;
      if (e.currentTarget.checked) {
        valueDescription = "60 Minutes";
        value = 60;
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "timeLimit",
        value,
        description: "Time Limit ",
        valueDescription
      });
    },
    checked: aInfo.timeLimit !== null
  }))), aInfo.timeLimit !== null ? /* @__PURE__ */ React.createElement("div", {
    style: {width: "fit-content"}
  }, "Time Limit in Minutes", /* @__PURE__ */ React.createElement(Increment, {
    value: timeLimit,
    min: 0,
    onBlur: (newValue) => {
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
  })) : null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Attempts Limit", /* @__PURE__ */ React.createElement(Switch, {
    name: "limitAttempts",
    onChange: (e) => {
      let valueDescription = "Not Limited";
      let value = null;
      if (e.currentTarget.checked) {
        valueDescription = "1";
        value = 1;
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "numberOfAttemptsAllowed",
        value,
        description: "Attempts Allowed ",
        valueDescription
      });
    },
    checked: aInfo.numberOfAttemptsAllowed !== null
  }))), aInfo.numberOfAttemptsAllowed !== null ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Number of Attempts Allowed", /* @__PURE__ */ React.createElement(Increment, {
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
  }))) : null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Attempt Aggregation", /* @__PURE__ */ React.createElement(DropdownMenu, {
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
      updateAssignment({
        doenetId,
        keyToUpdate: "attemptAggregation",
        value: val,
        description: "Attempt Aggregation",
        valueDescription
      });
    }
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Total Points Or Percent", /* @__PURE__ */ React.createElement(Increment, {
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
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Grade Category", /* @__PURE__ */ React.createElement("input", {
    required: true,
    type: "select",
    name: "gradeCategory",
    value: gradeCategory,
    onBlur: () => {
      if (aInfo.gradeCategory !== gradeCategory) {
        updateAssignment({
          doenetId,
          keyToUpdate: "gradeCategory",
          value: gradeCategory,
          description: "Grade Category"
        });
      }
    },
    onKeyDown: (e) => {
      if (e.key === "Enter" && aInfo.gradeCategory !== gradeCategory) {
        updateAssignment({
          doenetId,
          keyToUpdate: "gradeCategory",
          value: gradeCategory,
          description: "Grade Category"
        });
      }
    },
    onChange: (e) => setGradeCategory(e.currentTarget.value)
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Individualize", /* @__PURE__ */ React.createElement(Switch, {
    name: "individualize",
    onChange: (e) => {
      let valueDescription = "False";
      if (e.currentTarget.checked) {
        valueDescription = "True";
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "individualize",
        value: e.currentTarget.checked,
        description: "Individualize",
        valueDescription
      });
    },
    checked: individualize
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show Solution", /* @__PURE__ */ React.createElement(Switch, {
    name: "showSolution",
    onChange: (e) => {
      let valueDescription = "False";
      if (e.currentTarget.checked) {
        valueDescription = "True";
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "showSolution",
        value: e.currentTarget.checked,
        description: "Show Solution",
        valueDescription
      });
    },
    checked: showSolution
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show Solution In Gradebook", /* @__PURE__ */ React.createElement(Switch, {
    name: "showSolutionInGradebook",
    onChange: (e) => {
      let valueDescription = "False";
      if (e.currentTarget.checked) {
        valueDescription = "True";
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "showSolutionInGradebook",
        value: e.currentTarget.checked,
        description: "Show Solution In Gradebook",
        valueDescription
      });
    },
    checked: showSolutionInGradebook
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show Feedback", /* @__PURE__ */ React.createElement(Switch, {
    name: "showFeedback",
    onChange: (e) => {
      let valueDescription = "False";
      if (e.currentTarget.checked) {
        valueDescription = "True";
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "showFeedback",
        value: e.currentTarget.checked,
        description: "Show Feedback",
        valueDescription
      });
    },
    checked: showFeedback
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show Hints", /* @__PURE__ */ React.createElement(Switch, {
    name: "showHints",
    onChange: (e) => {
      let valueDescription = "False";
      if (e.currentTarget.checked) {
        valueDescription = "True";
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "showHints",
        value: e.currentTarget.checked,
        description: "Show Hints",
        valueDescription
      });
    },
    checked: showHints
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show Correctness", /* @__PURE__ */ React.createElement(Switch, {
    name: "showCorrectness",
    onChange: (e) => {
      let valueDescription = "False";
      if (e.currentTarget.checked) {
        valueDescription = "True";
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "showCorrectness",
        value: e.currentTarget.checked,
        description: "Show Correctness",
        valueDescription
      });
    },
    checked: showCorrectness
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show Credit Achieved Menu", /* @__PURE__ */ React.createElement(Switch, {
    name: "showCreditAchievedMenu",
    onChange: (e) => {
      let valueDescription = "False";
      if (e.currentTarget.checked) {
        valueDescription = "True";
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "showCreditAchievedMenu",
        value: e.currentTarget.checked,
        description: "Show Credit Achieved Menu",
        valueDescription
      });
    },
    checked: showCreditAchievedMenu
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Proctor Makes Available", /* @__PURE__ */ React.createElement(Switch, {
    name: "proctorMakesAvailable",
    onChange: (e) => {
      let valueDescription = "False";
      if (e.currentTarget.checked) {
        valueDescription = "True";
      }
      updateAssignment({
        doenetId,
        keyToUpdate: "proctorMakesAvailable",
        value: e.currentTarget.checked,
        description: "Proctor Makes Available",
        valueDescription
      });
    },
    checked: proctorMakesAvailable
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Pin Assignment", /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex"},
    onClick: (e) => {
      e.preventDefault();
    }
  }, /* @__PURE__ */ React.createElement(CalendarToggle, {
    checked: aInfo.pinnedUntilDate !== null,
    onClick: (e) => {
      let valueDescription = "None";
      let value = null;
      let secondValue = null;
      if (aInfo.pinnedUntilDate === null) {
        valueDescription = "Now to Next Year";
        let today = new Date();
        let nextYear = new Date();
        nextYear.setDate(nextYear.getDate() + 365);
        value = DateToDateString(today);
        secondValue = DateToDateString(nextYear);
      }
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
  }), aInfo.pinnedUntilDate !== null ? /* @__PURE__ */ React.createElement(DateTime, {
    value: aInfo.pinnedAfterDate ? new Date(aInfo.pinnedAfterDate) : null,
    onBlur: ({valid, value}) => {
      if (valid) {
        try {
          value = value.toDate();
        } catch (e) {
        }
        if (new Date(DateToDateString(value)).getTime() !== new Date(aInfo.pinnedAfterDate).getTime()) {
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
  }) : /* @__PURE__ */ React.createElement("input", {
    onClick: (e) => {
      let valueDescription = "None";
      let value = null;
      let secondValue = null;
      if (aInfo.pinnedUntilDate === null) {
        valueDescription = "Now to Next Year";
        let today = new Date();
        let nextYear = new Date();
        nextYear.setDate(nextYear.getDate() + 365);
        value = DateToDateString(today);
        secondValue = DateToDateString(nextYear);
      }
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
    value: "No Pin After Date",
    style: {
      color: "#545454",
      height: "18px",
      width: "177px",
      border: "2px solid black",
      borderRadius: "5px"
    }
  })), /* @__PURE__ */ React.createElement("div", {
    style: {marginLeft: "28px"},
    onClick: (e) => {
      e.preventDefault();
    }
  }, aInfo.pinnedUntilDate !== null ? /* @__PURE__ */ React.createElement(DateTime, {
    value: aInfo.pinnedUntilDate ? new Date(aInfo.pinnedUntilDate) : null,
    onBlur: ({valid, value}) => {
      if (valid) {
        try {
          value = value.toDate();
        } catch (e) {
        }
        if (new Date(DateToDateString(value)).getTime() !== new Date(aInfo.pinnedUntilDate).getTime()) {
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
  }) : /* @__PURE__ */ React.createElement("input", {
    onClick: (e) => {
      let valueDescription = "None";
      let value = null;
      let secondValue = null;
      if (aInfo.pinnedUntilDate === null) {
        valueDescription = "Now to Next Year";
        let today = new Date();
        let nextYear = new Date();
        nextYear.setDate(nextYear.getDate() + 365);
        value = DateToDateString(today);
        secondValue = DateToDateString(nextYear);
      }
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
    value: "No Pin Until Date",
    style: {
      color: "#545454",
      height: "18px",
      width: "177px",
      border: "2px solid black",
      borderRadius: "5px"
    }
  })))));
}
export const selectedInformation = selector({
  key: "selectedInformation",
  get: ({get}) => {
    const globalSelected = get(globalSelectedNodesAtom);
    if (globalSelected.length !== 1) {
      return globalSelected;
    }
    const driveId = globalSelected[0].driveId;
    const folderId = globalSelected[0].parentFolderId;
    const driveInstanceId = globalSelected[0].driveInstanceId;
    let folderInfo = get(folderDictionary({driveId, folderId}));
    const itemId = globalSelected[0].itemId;
    let itemInfo = {
      ...folderInfo.contentsDictionary[itemId] ?? {
        ...folderInfo.folderInfo
      }
    };
    itemInfo["driveId"] = driveId;
    itemInfo["driveInstanceId"] = driveInstanceId;
    return [itemInfo];
  }
});
