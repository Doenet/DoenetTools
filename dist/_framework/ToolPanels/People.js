import React, {useCallback, useState} from "../../_snowpack/pkg/react.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {useRecoilState, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import Checkbox from "../../_reactComponents/PanelHeaderComponents/Checkbox.js";
import {peopleByCourseId} from "../../_reactComponents/Course/CourseActions.js";
import {AddUserWithOptions} from "../../_reactComponents/Course/SettingComponents.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import Measure from "../../_snowpack/pkg/react-measure.js";
import {RoleDropdown} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {useCourse} from "../../_reactComponents/Course/CourseActions.js";
import {
  csvPeopleProcess,
  entriesAtom,
  headersAtom,
  processAtom,
  validHeaders
} from "../Menus/LoadPeople.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
const InputWrapper = styled.div`
  margin: 0 5px 10px 5px;
  display: ${(props) => props.flex ? "flex" : "block"};
  align-items: ${(props) => props.flex && "center"};
  gap: 4px;
`;
const CheckboxLabelText = styled.span`
  font-size: 15px;
  line-height: 1.1;
`;
export default function People() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {
    recoilUnWithdraw,
    recoilWithdraw,
    recoilMergeData,
    value: peopleTableData
  } = useRecoilValue(peopleByCourseId(courseId));
  const {modifyUserRole, defaultRoleId} = useCourse(courseId);
  let [showWithdrawn, setShowWithdrawn] = useState(false);
  const [numberOfVisibleColumns, setNumberOfVisibleColumns] = useState(1);
  const [process, setProcess] = useRecoilState(processAtom);
  const headers = useRecoilValue(headersAtom);
  const entries = useRecoilValue(entriesAtom);
  const [selectedRoleId, setSelectedRoleId] = useState(defaultRoleId);
  if (!courseId) {
    return null;
  }
  const enrollLearners = (e, enrollLearner) => {
    e.preventDefault();
    recoilUnWithdraw(enrollLearner);
  };
  const withDrawLearners = (e, withdrewLearner) => {
    e.preventDefault();
    recoilWithdraw(withdrewLearner);
  };
  if (process === csvPeopleProcess.PREVIEW) {
    return /* @__PURE__ */ React.createElement("div", {
      style: {padding: "8px"}
    }, /* @__PURE__ */ React.createElement("h2", null, "Preview CSV People"), /* @__PURE__ */ React.createElement(RoleDropdown, {
      label: "Assigned Role",
      valueRoleId: selectedRoleId ?? defaultRoleId,
      onChange: ({value: roleId}) => {
        setSelectedRoleId(roleId);
      },
      maxMenuHeight: "200px",
      vertical: true
    }), /* @__PURE__ */ React.createElement(PeopleTabelHeader, {
      columnLabels: headers.filter((head) => validHeaders[head] ?? false),
      numberOfVisibleColumns,
      setNumberOfVisibleColumns
    }), entries.map((entry, idx) => /* @__PURE__ */ React.createElement(PreviewTableRow, {
      key: `${entry[0]} ${idx}`,
      numberOfVisibleColumns,
      entryData: entry,
      headers
    })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
      onClick: () => {
        setProcess(csvPeopleProcess.IDLE);
      },
      value: "Cancel",
      "data-test": "Cancel"
    }), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => {
        const mergePayload = {
          roleId: selectedRoleId ?? defaultRoleId,
          mergeHeads: headers,
          mergeExternalId: [],
          mergeFirstName: [],
          mergeLastName: [],
          mergeSection: [],
          mergeEmail: []
        };
        for (const entry of entries) {
          entry.map((candidateData, colIdx) => {
            if (validHeaders[headers[colIdx]])
              mergePayload[`merge${headers[colIdx]}`].push(candidateData);
          });
        }
        recoilMergeData(mergePayload, () => {
          setProcess(csvPeopleProcess.IDLE);
        });
      },
      value: "Merge",
      "data-test": "Merge",
      alert: true
    })));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {padding: "8px"}
  }, /* @__PURE__ */ React.createElement("h2", null, "Add Person"), /* @__PURE__ */ React.createElement(AddUserWithOptions, {
    courseId
  }), /* @__PURE__ */ React.createElement("h2", null, "Current People"), peopleTableData.length > 0 ? /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    onClick: () => {
      setShowWithdrawn(!showWithdrawn);
    },
    dataTest: "Show Withdrawn",
    checked: showWithdrawn
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, "Show Withdrawn")) : null, /* @__PURE__ */ React.createElement(PeopleTabelHeader, {
    columnLabels: ["Name", "Email", "Role", "Date Added"],
    numberOfVisibleColumns,
    setNumberOfVisibleColumns
  }), /* @__PURE__ */ React.createElement("div", {
    "data-test": "People Table"
  }, peopleTableData.map(({
    email,
    firstName,
    lastName,
    screenName,
    dateEnrolled,
    roleId,
    withdrew
  }) => {
    const columnsJSX = [
      email,
      /* @__PURE__ */ React.createElement(RoleDropdown, {
        key: "role",
        valueRoleId: roleId,
        onChange: ({value: newRoleId}) => {
          modifyUserRole(email, newRoleId, () => {
          });
        },
        width: "150px"
      }),
      dateEnrolled,
      /* @__PURE__ */ React.createElement(Button, {
        key: "withdraw",
        value: withdrew === "0" ? "Withdraw" : "Enroll",
        "data-test": withdrew === "0" ? `Withdraw ${email}` : `Enroll ${email}`,
        onClick: (e) => {
          if (withdrew === "0") {
            withDrawLearners(e, email);
          } else {
            enrollLearners(e, email);
          }
        }
      })
    ];
    if (!showWithdrawn && withdrew === "1")
      return null;
    return /* @__PURE__ */ React.createElement(PeopleTableRow, {
      key: email,
      label: `${firstName} ${lastName} (${screenName})`,
      numberOfVisibleColumns,
      columnsJSX
    });
  })), peopleTableData.length === 0 ? /* @__PURE__ */ React.createElement("p", null, "No Students are currently enrolled in the course") : null);
}
function PeopleTabelHeader({
  columnLabels,
  numberOfVisibleColumns,
  setNumberOfVisibleColumns
}) {
  const updateNumColumns = useCallback((width) => {
    const maxColumns = columnLabels.length + 1;
    const breakpoints = [375, 500, 650, 800];
    if (width >= breakpoints[3] && numberOfVisibleColumns !== 5) {
      const nextNumberOfVisibleColumns = Math.min(maxColumns, 5);
      setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
    } else if (width < breakpoints[3] && width >= breakpoints[2] && numberOfVisibleColumns !== 4) {
      const nextNumberOfVisibleColumns = Math.min(maxColumns, 4);
      setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
    } else if (width < breakpoints[2] && width >= breakpoints[1] && numberOfVisibleColumns !== 3) {
      const nextNumberOfVisibleColumns = Math.min(maxColumns, 3);
      setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
    } else if (width < breakpoints[1] && width >= breakpoints[0] && numberOfVisibleColumns !== 2) {
      const nextNumberOfVisibleColumns = Math.min(maxColumns, 2);
      setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
    } else if (width < breakpoints[0] && numberOfVisibleColumns !== 1) {
      setNumberOfVisibleColumns?.(1);
    } else if (numberOfVisibleColumns > maxColumns) {
      setNumberOfVisibleColumns?.(maxColumns);
    }
  }, [columnLabels, numberOfVisibleColumns, setNumberOfVisibleColumns]);
  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);
  return /* @__PURE__ */ React.createElement(Measure, {
    bounds: true,
    onResize: (contentRect) => {
      const width = contentRect.bounds.width;
      updateNumColumns(width);
    }
  }, ({measureRef}) => /* @__PURE__ */ React.createElement("div", {
    ref: measureRef,
    className: "noselect nooutline",
    style: {
      padding: "8px",
      border: "0px",
      borderBottom: "1px solid var(--canvastext)",
      maxWidth: "850px",
      margin: "0px"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: columnsCSS,
      gridTemplateRows: "1fr",
      alignContent: "center",
      gap: "4px"
    }
  }, /* @__PURE__ */ React.createElement("span", null, columnLabels[0]), numberOfVisibleColumns >= 2 && columnLabels[1] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnLabels[1]) : null, numberOfVisibleColumns >= 3 && columnLabels[2] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnLabels[2]) : null, numberOfVisibleColumns >= 4 && columnLabels[3] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnLabels[3]) : null, numberOfVisibleColumns >= 5 && columnLabels[4] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnLabels[4]) : null)));
}
function PeopleTableRow({numberOfVisibleColumns, label, columnsJSX = []}) {
  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);
  return /* @__PURE__ */ React.createElement("div", {
    className: "navigationRow noselect nooutline",
    style: {
      padding: "8px",
      border: "0px",
      borderBottom: "2px solid var(--canvastext)",
      backgroundColor: "var(--canvas)",
      color: "var(--canvastext)",
      width: "auto",
      maxWidth: "850px"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: columnsCSS,
      gridTemplateRows: "1fr",
      alignContent: "center",
      gap: "4px"
    }
  }, /* @__PURE__ */ React.createElement("span", {
    className: "navigationColumn1"
  }, /* @__PURE__ */ React.createElement("p", {
    style: {
      display: "inline",
      margin: "0px"
    }
  }, /* @__PURE__ */ React.createElement("span", {
    style: {marginLeft: "4px"},
    "data-test": "rowLabel"
  }, label, " "))), columnsJSX.map((value, idx) => numberOfVisibleColumns > idx + 1 ? /* @__PURE__ */ React.createElement("span", {
    key: idx,
    className: `navigationColumn${idx + 1}`,
    style: {textAlign: "left"}
  }, value) : null)));
}
function PreviewTableRow({numberOfVisibleColumns, entryData, headers}) {
  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);
  const columnsJSX = [];
  entryData.map((candidateData, colIdx) => {
    if (validHeaders[headers[colIdx]])
      columnsJSX.push(candidateData);
  });
  return /* @__PURE__ */ React.createElement("div", {
    className: "navigationRow noselect nooutline",
    style: {
      padding: "8px",
      border: "0px",
      borderBottom: "2px solid var(--canvastext)",
      backgroundColor: "var(--canvas)",
      color: "var(--canvastext)",
      width: "auto",
      maxWidth: "850px"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: columnsCSS,
      gridTemplateRows: "1fr",
      alignContent: "center",
      gap: "4px"
    }
  }, columnsJSX.map((value, idx) => numberOfVisibleColumns > idx ? /* @__PURE__ */ React.createElement("span", {
    key: idx,
    className: `navigationColumn${idx + 1}`,
    style: {textAlign: idx + 1 > 1 ? "center" : "left"}
  }, value) : null)));
}
function getColumnsCSS(numberOfVisibleColumns) {
  let columnsCSS = `repeat(${numberOfVisibleColumns},minmax(150px, 1fr))`;
  return columnsCSS;
}
