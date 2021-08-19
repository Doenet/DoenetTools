import {faCode} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import {
  atom,
  selector,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilState,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {
  folderDictionaryFilterSelector,
  globalSelectedNodesAtom
} from "../../_reactComponents/Drive/NewDrive.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
import IncrementMenu from "../../_reactComponents/PanelHeaderComponents/IncrementMenu.js";
import useSockets from "../../_reactComponents/Sockets.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import {
  itemHistoryAtom,
  assignmentDictionarySelector,
  useAssignment
} from "../ToolHandlers/CourseToolHandler.js";
import {useAssignmentCallbacks} from "../../_reactComponents/Drive/DriveActions.js";
import {useToast} from "../Toast.js";
import Switch from "../Switch.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
export const selectedVersionAtom = atom({
  key: "selectedVersionAtom",
  default: ""
});
export default function SelectedDoenetML() {
  const [pageToolView, setPageToolView] = useRecoilState(pageToolViewAtom);
  const role = pageToolView.view;
  const setSelectedMenu = useSetRecoilState(selectedMenuPanelAtom);
  const selection = useRecoilValueLoadable(selectedInformation).getValue();
  const [item, setItem] = useState(selection[0]);
  const [label, setLabel] = useState(selection[0]?.label ?? "");
  const {deleteItem, renameItem} = useSockets("drive");
  const {
    addContentAssignment,
    changeSettings,
    updateVersionHistory,
    saveSettings,
    assignmentToContent,
    loadAvailableAssignment,
    publishContentAssignment,
    onAssignmentError
  } = useAssignment();
  const {makeAssignment, convertAssignmentToContent} = useAssignmentCallbacks();
  const [checkIsAssigned, setIsAssigned] = useState(false);
  const addToast = useToast();
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(item?.doenetId));
  useEffect(() => {
    if (!selection[0]) {
      setSelectedMenu("");
    } else {
      setItem(selection[0]);
      setLabel(selection[0]?.label);
    }
  }, [selection, setSelectedMenu]);
  const dIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faCode
  });
  let makeAssignmentforReleasedButton = null;
  const renameItemCallback = (newLabel) => {
    renameItem({
      driveIdFolderId: {
        driveId: item.driveId,
        folderId: item.parentFolderId
      },
      itemId: item.itemId,
      itemType: item.itemType,
      newLabel
    });
  };
  let contentId = "";
  let versionId = "";
  if (versionHistory.state === "loading") {
    return null;
  }
  if (versionHistory.state === "hasError") {
    console.error(versionHistory.contents);
    return null;
  }
  if (versionHistory.state === "hasValue") {
    contentId = versionHistory?.contents?.named[0]?.contentId;
    versionId = versionHistory?.contents?.named[0]?.versionId;
  }
  let doenetMLActions = /* @__PURE__ */ React.createElement(ActionButtonGroup, {
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
  }));
  if (role === "student") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", {
      "data-cy": "infoPanelItemLabel"
    }, dIcon, " ", item.label), /* @__PURE__ */ React.createElement(ActionButton, {
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
    }));
  }
  let assigned = /* @__PURE__ */ React.createElement(React.Fragment, null, versionHistory.contents.named.map((item2, i) => /* @__PURE__ */ React.createElement(React.Fragment, null, item2.isReleased == "1" ? /* @__PURE__ */ React.createElement("label", {
    key: i,
    value: item2.versionId
  }, item2.isAssigned == "1" ? "(Assigned)" : "", item2.title) : "")));
  makeAssignmentforReleasedButton = /* @__PURE__ */ React.createElement(Button, {
    value: "Make Assignment",
    onClick: async () => {
      setIsAssigned(true);
      let isAssigned = 1;
      const versionResult = await updateVersionHistory(item?.doenetId, versionId, isAssigned);
      const result = await addContentAssignment({
        driveIditemIddoenetIdparentFolderId: {
          driveId: item?.driveId,
          folderId: item?.parentFolderId,
          itemId: item?.itemId,
          doenetId: item?.doenetId,
          contentId,
          versionId
        },
        doenetId: item?.doenetId,
        contentId,
        versionId
      });
      let payload = {
        itemId: item?.itemId,
        isAssigned: "1",
        doenetId: item?.doenetId,
        contentId,
        driveId: item?.driveId,
        versionId
      };
      makeAssignment({
        driveIdFolderId: {
          driveId: item?.driveId,
          folderId: item?.parentFolderId
        },
        itemId: item?.itemId,
        payload
      });
      try {
        if (result.success && versionResult) {
          addToast(`Add new assignment`);
        } else {
          onAssignmentError({errorMessage: result.message});
        }
      } catch (e) {
        onAssignmentError({errorMessage: e});
      }
    }
  });
  let unAssignButton = null;
  unAssignButton = /* @__PURE__ */ React.createElement(Button, {
    value: "Unassign",
    onClick: async () => {
      let isAssigned = 0;
      const versionResult = await updateVersionHistory(item?.doenetId, versionId, isAssigned);
      assignmentToContent({
        driveIditemIddoenetIdparentFolderId: {
          driveId: item?.driveId,
          folderId: item?.parentFolderId,
          itemId: item?.itemId,
          doenetId: item?.doenetId,
          contentId,
          versionId
        },
        doenetId: item?.doenetId,
        contentId,
        versionId
      });
      convertAssignmentToContent({
        driveIdFolderId: {
          driveId: item?.driveId,
          folderId: item?.parentFolderId
        },
        itemId: item?.itemId,
        doenetId: item?.doenetId,
        contentId,
        versionId
      });
      const result = axios.post(`/api/handleMakeContent.php`, {
        itemId: item?.itemId,
        doenetId: item?.doenetId,
        contentId,
        versionId
      });
      result.then((resp) => {
        if (resp.data.success) {
          addToast(`'UnAssigned ''`);
        } else {
          onAssignmentError({errorMessage: resp.data.message});
        }
      }).catch((e) => {
        onAssignmentError({errorMessage: e.message});
      });
    }
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "infoPanelItemLabel"
  }, dIcon, " ", item.label), doenetMLActions, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("label", null, "DoenetML Label", /* @__PURE__ */ React.createElement("input", {
    type: "text",
    "data-cy": "infoPanelItemLabelInput",
    value: label,
    onChange: (e) => setLabel(e.target.value),
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        if (item.label !== label) {
          renameItemCallback(label);
        }
      }
    },
    onBlur: () => {
      if (item.label !== label) {
        renameItemCallback(label);
      }
    }
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
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
  }), assigned, /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, item?.isAssigned === "0" && item?.isReleased === "1" && makeAssignmentforReleasedButton, item?.isAssigned == "1" && item?.isReleased === "1" && unAssignButton), item?.isAssigned == "1" && item?.isReleased === "1" && /* @__PURE__ */ React.createElement(AssignmentForm, {
    selection: item,
    versionId,
    contentId
  }));
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
    let folderInfo = get(folderDictionaryFilterSelector({driveId, folderId}));
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
const AssignmentForm = (props) => {
  const {changeSettings, saveSettings, onAssignmentError} = useAssignment();
  const {updateAssignmentTitle} = useAssignmentCallbacks();
  const addToast = useToast();
  const pageToolView = useRecoilValue(pageToolViewAtom);
  const [oldValue, setoldValue] = useState();
  const assignmentInfoSettings = useRecoilValueLoadable(assignmentDictionarySelector({
    driveId: props.selection?.driveId,
    folderId: props.selection?.parentFolderId,
    itemId: props.selection?.itemId,
    doenetId: props.selection?.doenetId,
    versionId: props.versionId,
    contentId: props.contentId
  }));
  let aInfo = "";
  if (assignmentInfoSettings?.state === "hasValue") {
    aInfo = assignmentInfoSettings?.contents;
  }
  const handleOnBlur = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let value = e.target.value;
    if (value !== oldValue) {
      const result = saveSettings({
        [name]: value,
        driveIditemIddoenetIdparentFolderId: {
          driveId: props.selection?.driveId,
          folderId: props.selection?.parentFolderId,
          itemId: props.selection?.itemId,
          doenetId: props.selection?.doenetId,
          versionId: props.versionId,
          contentId: props.contentId
        }
      });
      let payload = {
        ...aInfo,
        itemId: props.selection?.itemId,
        isAssigned: "1",
        [name]: value,
        doenetId: props.selection?.doenetId,
        contentId: props.contentId
      };
      updateAssignmentTitle({
        driveIdFolderId: {
          driveId: props.selection?.driveId,
          folderId: props.selection?.parentFolderId
        },
        itemId: props.selection?.itemId,
        payloadAssignment: payload,
        doenetId: props.selection?.doenetId,
        contentId: props.contentId
      });
      result.then((resp) => {
        if (resp.data.success) {
          addToast(`Updated '${name}' to '${value}'`);
        } else {
          onAssignmentError({errorMessage: resp.data.message});
        }
      }).catch((e2) => {
        onAssignmentError({errorMessage: e2.message});
      });
    }
  };
  const handleChange = (event) => {
    event.preventDefault();
    let name = event.target.name;
    let value = event.target.value;
    const result = changeSettings({
      [name]: value,
      driveIditemIddoenetIdparentFolderId: {
        driveId: props.selection?.driveId,
        folderId: props.selection?.parentFolderId,
        itemId: props.selection?.itemId,
        doenetId: props.selection?.doenetId,
        versionId: props.versionId,
        contentId: props.contentId
      }
    });
  };
  const handleOnfocus = (event) => {
    event.preventDefault();
    let name = event.target.name;
    let value = event.target.value;
    setoldValue(event.target.value);
  };
  let assignmentForm = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", null, "Assignment Info"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Assigned Date:"), /* @__PURE__ */ React.createElement("input", {
    required: true,
    type: "text",
    name: "assignedDate",
    value: aInfo ? aInfo?.assignedDate : "",
    placeholder: "0001-01-01 01:01:01 ",
    onBlur: handleOnBlur,
    onChange: handleChange,
    onFocus: handleOnfocus
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Due date: "), /* @__PURE__ */ React.createElement("input", {
    required: true,
    type: "text",
    name: "dueDate",
    value: aInfo ? aInfo?.dueDate : "",
    placeholder: "0001-01-01 01:01:01",
    onBlur: handleOnBlur,
    onChange: handleChange,
    onFocus: handleOnfocus
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Time Limit:"), /* @__PURE__ */ React.createElement("input", {
    required: true,
    type: "time",
    name: "timeLimit",
    value: aInfo ? aInfo?.timeLimit : "",
    placeholder: "01:01:01",
    onBlur: handleOnBlur,
    onChange: handleChange,
    onFocus: handleOnfocus
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Number Of Attempts:"), /* @__PURE__ */ React.createElement(IncrementMenu, {
    range: [0, 20]
  }), /* @__PURE__ */ React.createElement("input", {
    required: true,
    type: "number",
    name: "numberOfAttemptsAllowed",
    value: aInfo ? aInfo?.numberOfAttemptsAllowed : "",
    onBlur: handleOnBlur,
    onChange: handleChange,
    onFocus: handleOnfocus
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Attempt Aggregation :"), /* @__PURE__ */ React.createElement("select", {
    name: "attemptAggregation",
    onChange: handleOnBlur
  }, /* @__PURE__ */ React.createElement("option", {
    value: "m",
    selected: aInfo?.attemptAggregation === "m" ? "selected" : ""
  }, "Maximum"), /* @__PURE__ */ React.createElement("option", {
    value: "l",
    selected: aInfo?.attemptAggregation === "l" ? "selected" : ""
  }, "Last Attempt"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Total Points Or Percent: "), /* @__PURE__ */ React.createElement("input", {
    required: true,
    type: "number",
    name: "totalPointsOrPercent",
    value: aInfo ? aInfo?.totalPointsOrPercent : "",
    onBlur: handleOnBlur,
    onChange: handleChange,
    onFocus: handleOnfocus
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Grade Category: "), /* @__PURE__ */ React.createElement("input", {
    required: true,
    type: "select",
    name: "gradeCategory",
    value: aInfo ? aInfo?.gradeCategory : "",
    onBlur: handleOnBlur,
    onChange: handleChange,
    onFocus: handleOnfocus
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Individualize: "), /* @__PURE__ */ React.createElement(Switch, {
    name: "individualize",
    onChange: handleOnBlur,
    checked: aInfo ? aInfo?.individualize : false
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Multiple Attempts: "), /* @__PURE__ */ React.createElement(Switch, {
    name: "multipleAttempts",
    onChange: handleOnBlur,
    checked: aInfo ? aInfo?.multipleAttempts : false
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show solution: "), /* @__PURE__ */ React.createElement(Switch, {
    name: "showSolution",
    onChange: handleOnBlur,
    checked: aInfo ? aInfo?.showSolution : false
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show feedback: "), /* @__PURE__ */ React.createElement(Switch, {
    name: "showFeedback",
    onChange: handleOnBlur,
    checked: aInfo ? aInfo?.showFeedback : false
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show hints: "), /* @__PURE__ */ React.createElement(Switch, {
    name: "showHints",
    onChange: handleOnBlur,
    checked: aInfo ? aInfo?.showHints : false
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show correctness: "), /* @__PURE__ */ React.createElement(Switch, {
    name: "showCorrectness",
    onChange: handleOnBlur,
    checked: aInfo ? aInfo?.showCorrectness : false
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Proctor make available: "), /* @__PURE__ */ React.createElement(Switch, {
    name: "proctorMakesAvailable",
    onChange: handleOnBlur,
    checked: aInfo ? aInfo?.proctorMakesAvailable : false
  })), /* @__PURE__ */ React.createElement("br", null)));
  let studentAInfo = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, "Due: ", aInfo?.dueDate), /* @__PURE__ */ React.createElement("p", null, "Time Limit: ", aInfo?.timeLimit), /* @__PURE__ */ React.createElement("p", null, "Number of Attempts Allowed: ", aInfo?.numberOfAttemptsAllowed), /* @__PURE__ */ React.createElement("p", null, "Points: ", aInfo?.totalPointsOrPercent)));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, pageToolView?.view == "student" ? /* @__PURE__ */ React.createElement(React.Fragment, null, studentAInfo) : "", pageToolView?.view == "instructor" ? /* @__PURE__ */ React.createElement(React.Fragment, null, assignmentForm) : " ");
};
