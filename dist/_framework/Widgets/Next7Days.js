import React, {useState} from "../../_snowpack/pkg/react.js";
import {
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
  atom
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import {
  selectedDriveAtom,
  selectedDriveItems,
  itemType,
  clearDriveAndItemSelections
} from "../../_reactComponents/Drive/NewDrive.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import axios from "../../_snowpack/pkg/axios.js";
import Checkbox from "../../_reactComponents/PanelHeaderComponents/Checkbox.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {globalSelectedNodesAtom} from "../../_reactComponents/Drive/NewDrive.js";
import {mainPanelClickAtom} from "../Panels/NewMainPanel.js";
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {UTCDateStringToDate} from "../../_utils/dateUtilityFunction.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faChevronLeft,
  faChevronRight,
  faThumbtack
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export const classTimesAtom = atom({
  key: "classTimesAtom",
  default: []
});
export const showCompletedAtom = atom({
  key: "showCompletedAtom",
  default: true
});
export const showOverdueAtom = atom({
  key: "showOverdueAtom",
  default: false
});
function formatAssignedDate(dt, classTimes, dueDT, thisWeek) {
  if (dt == "Invalid Date" || dt == null) {
    return null;
  }
  let dtDOTW = dt.getDay();
  for (let classTime of classTimes) {
    if (classTime.dotwIndex == dtDOTW) {
      let classStartDT = new Date(dt.getTime());
      const [starthours, startminutes] = classTime.startTime.split(":");
      classStartDT.setHours(starthours, startminutes, 0, 0);
      let classEndDT = new Date(dt.getTime());
      const [endhours, endminutes] = classTime.endTime.split(":");
      classEndDT.setHours(endhours, endminutes, 0, 0);
      if (dt >= classStartDT && dt < classEndDT) {
        if (dt.getMonth() != dueDT.getMonth() || dt.getDate() != dueDT.getDate()) {
          return `In Class ${dt.getMonth() + 1}/${dt.getDate()}`;
        }
        return "In Class";
      } else if (dt.getTime() == classEndDT.getTime()) {
        if (dt.getMonth() != dueDT.getMonth() || dt.getDate() != dueDT.getDate()) {
          return `After Class ${dt.getMonth() + 1}/${dt.getDate()}`;
        }
        return "After Class";
      }
    }
  }
  let time = dt.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
  if (time === "Invalid Date") {
    time = null;
  }
  if (thisWeek) {
    let today = new Date();
    let yesterday = new Date(today.getTime() + 1e3 * 60 * 60 * 24 * -1);
    let tomorrow = new Date(today.getTime() + 1e3 * 60 * 60 * 24 * 1);
    if (dt.getMonth() == yesterday.getMonth() && dt.getDate() == yesterday.getDate() && dt.getFullYear() == yesterday.getFullYear()) {
      return `Yesterday - ${time}`;
    }
    if (dt.getMonth() == tomorrow.getMonth() && dt.getDate() == tomorrow.getDate() && dt.getFullYear() == tomorrow.getFullYear()) {
      return `Tomorrow - ${time}`;
    }
    const dotwLabel = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];
    return `${dotwLabel[dt.getDay()]} - ${time}`;
  }
  let returnValue = `${dt.getMonth() + 1}/${dt.getDate()} ${time}`;
  if (time === null) {
    returnValue = null;
  }
  return returnValue;
}
function formatDueDate(dt, classTimes) {
  if (dt == "Invalid Date" || dt == null) {
    return null;
  }
  let dtDOTW = dt.getDay();
  for (let classTime of classTimes) {
    if (classTime.dotwIndex == dtDOTW) {
      let classStartDT = new Date(dt.getTime());
      const [starthours, startminutes] = classTime.startTime.split(":");
      classStartDT.setHours(starthours, startminutes, 0, 0);
      let classEndDT = new Date(dt.getTime());
      const [endhours, endminutes] = classTime.endTime.split(":");
      classEndDT.setHours(endhours, endminutes, 0, 0);
      if (dt >= classStartDT && dt < classEndDT) {
        return "In Class";
      } else if (dt.getTime() == classEndDT.getTime()) {
        return "End of Class";
      }
    }
  }
  let returnValue = dt.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
  returnValue = `${dt.getMonth() + 1}/${dt.getDate()} ${returnValue}`;
  if (returnValue === "Invalid Date") {
    returnValue = null;
  }
  return returnValue;
}
function buildRows({
  dotw = "",
  rowLabel = "",
  assignments,
  clickCallback,
  doubleClickCallback,
  completedArray,
  setCompletedArray,
  classTimes,
  weekShift,
  selectedItemId,
  showCompleted
}) {
  let newRows = [];
  if (assignments.length > 0) {
    let isFirstRow = true;
    let numberOfVisibleRows = 0;
    for (let assignment of assignments) {
      let checked = completedArray.includes(assignment.doenetId);
      if (showCompleted || !showCompleted && !checked) {
        numberOfVisibleRows++;
      }
    }
    for (let i = 0; i < assignments.length; i++) {
      let assignment = assignments[i];
      let assignedDate = UTCDateStringToDate(assignment.assignedDate);
      let displayAssignedDate = "";
      if (assignedDate) {
        assignedDate.setSeconds(0, 0);
      }
      let dueDate = UTCDateStringToDate(assignment.dueDate);
      let displayDueDate = "";
      let effectiveRowLabel = "";
      if (dueDate) {
        dueDate.setSeconds(0, 0);
        effectiveRowLabel = `${dotw} `;
        displayDueDate = formatDueDate(dueDate, classTimes);
        if (assignedDate) {
          displayAssignedDate = formatAssignedDate(assignedDate, classTimes, dueDate, weekShift == 0);
        }
      }
      if (rowLabel !== "") {
        effectiveRowLabel = rowLabel;
      }
      let bgColor = null;
      if (assignment.itemId === selectedItemId) {
        bgColor = "#B8D2EA";
      }
      let oneClick = (e) => {
        e.stopPropagation();
        clickCallback({
          driveId: assignment.driveId,
          itemId: assignment.itemId,
          driveInstanceId: "currentContent",
          type: assignment.itemType,
          instructionType: "one item",
          parentFolderId: assignment.parentFolderId
        });
      };
      let path = `${assignment.driveId}:${assignment.parentFolderId}:${assignment.itemId}:${assignment.itemType}`;
      let doubleClick = () => doubleClickCallback({
        type: assignment.itemType,
        doenetId: assignment.doenetId,
        path
      });
      let checked = completedArray.includes(assignment.doenetId);
      if (!showCompleted && checked) {
        continue;
      }
      let checkbox = /* @__PURE__ */ React.createElement(Checkbox, {
        checked,
        onClick: (e) => {
          e.stopPropagation();
          if (checked) {
            setCompletedArray((was) => {
              let newObj = [...was];
              newObj.splice(newObj.indexOf(assignment.doenetId), 1);
              return newObj;
            });
          } else {
            setCompletedArray((was) => {
              let newObj = [assignment.doenetId, ...was];
              return newObj;
            });
          }
          axios.get("/api/saveCompleted.php", {
            params: {doenetId: assignment.doenetId}
          });
        }
      });
      if (isFirstRow) {
        isFirstRow = false;
        newRows.push(/* @__PURE__ */ React.createElement("tr", {
          key: `${effectiveRowLabel}${assignment.doenetId}`
        }, /* @__PURE__ */ React.createElement("td", {
          style: {borderBottom: "2px solid black", padding: "8px"},
          rowSpan: numberOfVisibleRows
        }, effectiveRowLabel), /* @__PURE__ */ React.createElement("td", {
          style: {
            backgroundColor: bgColor,
            padding: "8px",
            borderBottom: "2px solid black"
          },
          onClick: oneClick,
          onDoubleClick: doubleClick
        }, assignment.label), /* @__PURE__ */ React.createElement("td", {
          style: {
            backgroundColor: bgColor,
            padding: "8px",
            borderBottom: "2px solid black"
          },
          onClick: oneClick,
          onDoubleClick: doubleClick
        }, displayAssignedDate), /* @__PURE__ */ React.createElement("td", {
          style: {
            backgroundColor: bgColor,
            padding: "8px",
            borderBottom: "2px solid black"
          },
          onClick: oneClick,
          onDoubleClick: doubleClick
        }, displayDueDate), /* @__PURE__ */ React.createElement("td", {
          style: {
            backgroundColor: bgColor,
            padding: "8px",
            borderBottom: "2px solid black",
            textAlign: "center"
          }
        }, checkbox)));
      } else {
        newRows.push(/* @__PURE__ */ React.createElement("tr", {
          key: `${effectiveRowLabel}${assignment.doenetId}${i}`
        }, /* @__PURE__ */ React.createElement("td", {
          style: {
            backgroundColor: bgColor,
            padding: "8px",
            borderBottom: "2px solid black"
          },
          onClick: oneClick,
          onDoubleClick: doubleClick
        }, assignment.label), /* @__PURE__ */ React.createElement("td", {
          style: {
            backgroundColor: bgColor,
            padding: "8px",
            borderBottom: "2px solid black"
          },
          onClick: oneClick,
          onDoubleClick: doubleClick
        }, displayAssignedDate), /* @__PURE__ */ React.createElement("td", {
          style: {
            backgroundColor: bgColor,
            padding: "8px",
            borderBottom: "2px solid black"
          },
          onClick: oneClick,
          onDoubleClick: doubleClick
        }, displayDueDate), /* @__PURE__ */ React.createElement("td", {
          style: {
            backgroundColor: bgColor,
            padding: "8px",
            borderBottom: "2px solid black",
            textAlign: "center"
          }
        }, checkbox)));
      }
    }
  }
  return newRows;
}
export default function Next7Days({courseId}) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const showCompleted = useRecoilValue(showCompletedAtom);
  const showOverdue = useRecoilValue(showOverdueAtom);
  let [assignmentArray, setAssignmentArray] = useState([]);
  let [pinnedArray, setPinnedArray] = useState([]);
  let [completedArray, setCompletedArray] = useState([]);
  let [initialized, setInitialized] = useState(false);
  let [problemMessage, setProblemMessage] = useState("");
  let [weekShift, setWeekShift] = useState(0);
  let classTimes = useRecoilValue(classTimesAtom);
  let selected = useRecoilValue(globalSelectedNodesAtom);
  let selectedItemId = null;
  if (selected[0]?.driveInstanceId === "currentContent") {
    selectedItemId = selected[0].itemId;
  }
  let loadAssignmentArray = useRecoilCallback(({set}) => async (driveId) => {
    set(mainPanelClickAtom, (was) => [
      ...was,
      {atom: clearDriveAndItemSelections, value: null},
      {atom: selectedMenuPanelAtom, value: null}
    ]);
    const {data} = await axios.get("/api/loadTODO.php", {
      params: {driveId}
    });
    if (!data.success) {
      setProblemMessage(data.message);
      return;
    }
    if (data.assignments) {
      setAssignmentArray(data.assignments);
      setPinnedArray(data.pinned);
    }
    if (data.classTimes) {
      set(classTimesAtom, data.classTimes);
    }
    if (data.completed) {
      setCompletedArray(data.completed);
    }
  });
  const clickCallback = useRecoilCallback(({set}) => (info) => {
    switch (info.instructionType) {
      case "one item":
        set(selectedMenuPanelAtom, `Selected${info.type}`);
        break;
      case "range to item":
      case "add item":
        set(selectedMenuPanelAtom, `SelectedMulti`);
        break;
      case "clear all":
        set(selectedMenuPanelAtom, null);
        break;
      default:
        throw new Error("NavigationPanel found invalid select instruction");
    }
    set(selectedDriveItems({
      driveId: info.driveId,
      driveInstanceId: info.driveInstanceId,
      itemId: info.itemId
    }), {
      instructionType: info.instructionType,
      parentFolderId: info.parentFolderId
    });
    set(selectedDriveAtom, info.driveId);
  }, []);
  const doubleClickCallback = useRecoilCallback(({snapshot}) => async ({type, doenetId, path}) => {
    let {canEditContent} = await snapshot.getPromise(effectivePermissionsByCourseId(courseId));
    if (canEditContent === "1") {
      switch (type) {
        case itemType.DOENETML:
          setPageToolView({
            page: "course",
            tool: "editor",
            view: "",
            params: {
              doenetId,
              path
            }
          });
          break;
        case itemType.COLLECTION:
          setPageToolView({
            page: "course",
            tool: "editor",
            view: "",
            params: {
              doenetId,
              path,
              isCollection: true
            }
          });
          break;
        default:
          throw new Error("NavigationPanel doubleClick info type not defined");
      }
    } else {
      switch (type) {
        case itemType.DOENETML:
          setPageToolView({
            page: "course",
            tool: "assignment",
            view: "",
            params: {
              doenetId
            }
          });
          break;
        case itemType.COLLECTION:
          setPageToolView({
            page: "course",
            tool: "assignment",
            view: "",
            params: {
              doenetId,
              isCollection: true
            }
          });
          break;
        default:
          throw new Error("NavigationPanel doubleClick info type not defined");
      }
    }
  }, [courseId, setPageToolView]);
  if (!initialized && courseId !== "") {
    setInitialized(true);
    loadAssignmentArray(courseId);
    return null;
  }
  if (problemMessage !== "") {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, problemMessage));
  }
  let today = new Date();
  let diff = 1 - today.getDay();
  if (diff === 1) {
    diff = -6;
  }
  let monday = new Date(today.getTime() + 1e3 * 60 * 60 * 24 * diff + 1e3 * 60 * 60 * 24 * weekShift * 7);
  let sunday = new Date(monday.getTime() + 1e3 * 60 * 60 * 24 * 6);
  let headerMonday = `${monday.getMonth() + 1}/${monday.getDate()}`;
  let headerSunday = `${sunday.getMonth() + 1}/${sunday.getDate()}`;
  let pinnedRows = [];
  let overdueRows = [];
  let pinnedName = /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faThumbtack
  }), " Pinned");
  if (weekShift == 0) {
    pinnedRows.push(...buildRows({
      rowLabel: pinnedName,
      assignments: pinnedArray,
      clickCallback,
      doubleClickCallback,
      completedArray,
      setCompletedArray,
      classTimes,
      weekShift,
      selectedItemId,
      showCompleted
    }));
    if (showOverdue) {
      const now = new Date();
      let overdueArray = [];
      for (let assignment of assignmentArray) {
        const due = UTCDateStringToDate(assignment.dueDate);
        if (!due || due > now) {
          break;
        }
        if (!completedArray.includes(assignment.doenetId)) {
          overdueArray.push(assignment);
        }
      }
      overdueRows.push(...buildRows({
        rowLabel: "Overdue",
        assignments: overdueArray,
        clickCallback,
        doubleClickCallback,
        completedArray,
        setCompletedArray,
        classTimes,
        weekShift,
        selectedItemId,
        showCompleted
      }));
    }
  }
  let dayRows = [];
  let beginningOfMondayDT = new Date(monday.getTime());
  beginningOfMondayDT.setHours(0, 0, 0, 0);
  let endOfSundayDT = new Date(sunday.getTime());
  endOfSundayDT.setHours(23, 59, 59, 999);
  let dueByDOTW = [[], [], [], [], [], [], []];
  for (let i = 0; i < assignmentArray.length; i++) {
    let assignment = assignmentArray[i];
    let dueDate = UTCDateStringToDate(assignment.dueDate);
    if (!dueDate || dueDate < beginningOfMondayDT) {
      continue;
    }
    if (dueDate > endOfSundayDT) {
      break;
    }
    let assignmentDOTW = dueDate.getDay();
    dueByDOTW[assignmentDOTW].push({...assignment});
  }
  dueByDOTW.push(dueByDOTW.shift());
  const dotwLabel = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  for (let [index, dayAssignments] of Object.entries(dueByDOTW)) {
    dayRows.push(...buildRows({
      dotw: dotwLabel[index],
      assignments: dayAssignments,
      clickCallback,
      doubleClickCallback,
      completedArray,
      setCompletedArray,
      classTimes,
      weekShift,
      selectedItemId,
      showCompleted
    }));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
      width: "850px",
      height: "70px"
    }
  }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setWeekShift(0),
    value: "This Week"
  }), " "), /* @__PURE__ */ React.createElement("h1", null, "Content by Week"), /* @__PURE__ */ React.createElement("span", {
    style: {fontSize: "1.4em"}
  }, headerMonday, " - ", headerSunday), /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setWeekShift((was) => was - 1),
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faChevronLeft
    })
  })), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setWeekShift((was) => was + 1),
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faChevronRight
    })
  })))), /* @__PURE__ */ React.createElement("table", {
    style: {width: "850px", borderSpacing: "0em .2em"}
  }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", {
    style: {
      width: "150px",
      padding: "8px",
      textAlign: "left",
      borderBottom: "2px solid black"
    }
  }, "Day"), /* @__PURE__ */ React.createElement("th", {
    style: {
      width: "200px",
      padding: "8px",
      textAlign: "left",
      borderBottom: "2px solid black"
    }
  }, "Name"), /* @__PURE__ */ React.createElement("th", {
    style: {
      width: "200px",
      padding: "8px",
      textAlign: "left",
      borderBottom: "2px solid black"
    }
  }, "Assigned"), /* @__PURE__ */ React.createElement("th", {
    style: {
      width: "200px",
      padding: "8px",
      textAlign: "left",
      borderBottom: "2px solid black"
    }
  }, "Due"), /* @__PURE__ */ React.createElement("th", {
    style: {
      width: "100px",
      padding: "8px",
      textAlign: "center",
      borderBottom: "2px solid black"
    }
  }, "Completed")), pinnedRows, overdueRows, dayRows));
}
