import React, {useEffect, useRef, useState, Suspense} from "../_snowpack/pkg/react.js";
import styled from "../_snowpack/pkg/styled-components.js";
import {useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce} from "../_snowpack/pkg/react-table.js";
import Drive, {
  folderDictionarySelector,
  folderInfoSelectorActions,
  globalSelectedNodesAtom,
  folderDictionary,
  clearDriveAndItemSelections,
  fetchDrivesSelector,
  encodeParams,
  fetchDriveUsers,
  fetchDrivesQuery
} from "../_reactComponents/Drive/Drive.js";
import {
  atom,
  RecoilRoot,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable
} from "../_snowpack/pkg/recoil.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useHistory
} from "../_snowpack/pkg/react-router-dom.js";
import Tool from "../_framework/Tool.js";
import axios from "../_snowpack/pkg/axios.js";
import {FontAwesomeIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faChevronDown, faChevronRight} from "../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {faSort, faSortUp, faSortDown} from "../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {useToolControlHelper} from "../_framework/ToolRoot.js";
import DriveCards from "../_reactComponents/Drive/DriveCards.js";
import Button from "../_reactComponents/PanelHeaderComponents/Button.js";
export const Styles = styled.div`
  padding: 1rem;
  table {
    border-collapse: collapse;
    border-spacing: 0;
    border: 1px solid gray;
    
    thead {
        border-bottom: 1px solid gray;
    }
    
    a {
        color: inherit;
        text-decoration: none;
    }
    .sortIcon {
        padding-left: 4px;
    }
    tbody tr:nth-child(even) {background: #CCC}
    tbody tr:nth-child(odd) {background: #FFF}
    td:first-child {
        text-align: left;
        max-width: 15rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    th {
        position: sticky;
        top: 0;
        background: white;
        user-select: none;
        max-width: 4rem;
        //word-wrap: break-word;
        padding: 2px;
        max-height: 10rem;
    }
    th:first-child {
        vertical-align: bottom;
        max-width: 15rem;
        p {
            margin: 5px;
        }
    }
    th > p {
        height: 100%;
    }
    th:not(:first-child) > p{
        writing-mode: vertical-rl;
        text-align: left;
        transform: rotate(180deg);
    }
    td {
        user-select: none;
        text-align: center;
        max-width: 5rem;
    }
    td, th {
        border-right: 1px solid gray;
        :last-child {
            border-right: 0;
        }
    }
  }
`;
const courseId = atom({
  key: "courseId",
  default: ""
});
const coursesDataQuerry = atom({
  key: "coursesDataQuerry",
  default: selector({
    key: "coursesDataQuerry/Default",
    get: async () => {
      try {
        const {data} = await axios.get("/api/loadUserCourses.php");
        return data;
      } catch (error) {
        console.log("Error loading users course list", error.message);
        return {};
      }
    }
  })
});
const coursesData = selector({
  key: "coursesData",
  get: ({get}) => {
    let data = get(coursesDataQuerry);
    return data;
  }
});
const assignmentDataQuerry = atom({
  key: "assignmentDataQuerry",
  default: selector({
    key: "assignmentDataQuerry/Default",
    get: async ({get}) => {
      try {
        const courseIdPayload = {params: {courseId: get(courseId)}};
        const {data} = await axios.get("/api/loadAssignments.php", courseIdPayload);
        return data;
      } catch (error) {
        console.log("No assignments associated with course ID: ", get(courseId));
        return {};
      }
    }
  })
});
const assignmentData = selector({
  key: "assignmentData",
  get: ({get}) => {
    let assignmentArray = {};
    let data = get(assignmentDataQuerry);
    for (let row of data) {
      let [assignmentId2, assignmentName] = row;
      assignmentArray[assignmentId2] = assignmentName;
    }
    return assignmentArray;
  },
  set: ({set, get}, newValue) => {
  }
});
const studentDataQuerry = atom({
  key: "studentDataQuerry",
  default: selector({
    key: "studentDataQuerry/Default",
    get: async ({get}) => {
      const courseIdPayload = {params: {courseId: get(courseId)}};
      try {
        const {data} = await axios.get("/api/loadGradebookEnrollment.php", courseIdPayload);
        return data;
      } catch (error) {
        console.log("No students associated with course ID: ", get(courseId), error);
        return {};
      }
    }
  })
});
export const studentData = selector({
  key: "studentData",
  get: ({get}) => {
    let data = get(studentDataQuerry);
    let students = {};
    for (let row of data) {
      let [
        userId,
        firstName,
        lastName,
        courseCredit,
        courseGrade,
        overrideCourseGrade
      ] = row;
      students[userId] = {
        firstName,
        lastName,
        courseCredit,
        courseGrade,
        overrideCourseGrade
      };
    }
    return students;
  }
});
const overViewDataQuerry = atom({
  key: "overViewDataQuerry",
  default: selector({
    key: "overViewDataQuerry/Default",
    get: async ({get}) => {
      try {
        const courseIdPayload = {params: {courseId: get(courseId)}};
        let {data} = await axios.get("/api/loadGradebookOverview.php", courseIdPayload);
        return data;
      } catch (error) {
        console.log("Error loading overview data for courdse ID: ", get(courseId), error.message);
        return {};
      }
    }
  })
});
const overViewData = selector({
  key: "overViewData",
  get: ({get}) => {
    const students = get(studentData);
    const assignments = get(assignmentData);
    let overView = {};
    for (let userId in students) {
      overView[userId] = {
        grade: students[userId].courseGrade,
        assignments: {}
      };
      for (let assignmentId2 in assignments) {
        overView[userId].assignments[assignmentId2] = null;
      }
    }
    let data = get(overViewDataQuerry);
    for (let userAssignment in data) {
      let [
        assignmentId2,
        assignmentName,
        credit,
        userId
      ] = data[userAssignment];
      overView[userId].assignments[assignmentId2] = credit;
    }
    return overView;
  }
});
const attemptDataQuerry = atomFamily({
  key: "attemptDataQuerry",
  default: selectorFamily({
    key: "attemptDataQuerry/Default",
    get: (assignmentId2) => async () => {
      try {
        let assignmentIdPayload = {params: {assignmentId: assignmentId2}};
        let {data} = await axios.get("/api/loadGradebookAssignmentAttempts.php", assignmentIdPayload);
        return data;
      } catch (error) {
        console.log("Error loading attempts data for assignmentId: ", assignmentId2, error.message);
        return {};
      }
    }
  })
});
export const attemptData = selectorFamily({
  key: "attemptData",
  get: (assignmentId2) => ({get}) => {
    let attempts = {};
    const students = get(studentData);
    for (let userId in students) {
      attempts[userId] = {
        credit: null,
        attempts: {}
      };
    }
    let data = get(attemptDataQuerry(assignmentId2));
    for (let row of data) {
      let [
        userId,
        attemptNumber,
        assignmentCredit,
        assignmentCreditOverride,
        attemptCredit,
        attemptCreditOverride
      ] = row;
      attempts[userId].credit = assignmentCredit;
      attempts[userId].attempts[attemptNumber] = attemptCredit;
    }
    return attempts;
  }
});
const specificAttemptDataQuerry = atomFamily({
  key: "specificAttemptDataQuerry",
  default: selectorFamily({
    key: "specificAttemptDataQuerry/Default",
    get: (params) => async ({get}) => {
      try {
        let assignmentAttemptPayload = {params};
        let {data} = await axios.get("/api/loadAssignmentAttempt.php", assignmentAttemptPayload);
        return data;
      } catch (error) {
        console.log("Error loading specific attempt data for assignmentId: ", assignmentId, error.message);
        return {};
      }
    }
  })
});
export const specificAttemptData = selectorFamily({
  key: "specificAttemptData",
  get: (params) => ({get}) => {
    let data = get(specificAttemptDataQuerry(params));
    let specificAttempt = {
      assignmentAttempted: data.assignmentAttempted,
      doenetML: data.doenetML,
      stateVariables: data.stateVariables,
      variant: data.variant,
      assignmentCredit: data.assignmentCredit,
      assignmentCreditOverride: data.assignmentCreditOverride,
      attemptCredit: data.attemptCredit,
      attemptCreditOverride: data.attemptCreditOverride,
      timestamp: data.timestamp
    };
    return specificAttempt;
  }
});
export function Table({columns, data}) {
  const filterTypes = React.useMemo(() => ({
    text: (rows2, id, filterValue) => {
      return rows2.filter((row) => {
        const rowValue = row.values[id];
        return rowValue !== void 0 ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true;
      });
    }
  }), []);
  const defaultColumn = React.useMemo(() => ({
    Filter: DefaultColumnFilter
  }), []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable({
    columns,
    data,
    defaultColumn,
    filterTypes
  }, useFilters, useGlobalFilter, useSortBy);
  return /* @__PURE__ */ React.createElement("table", {
    ...getTableProps()
  }, /* @__PURE__ */ React.createElement("thead", null, headerGroups.map((headerGroup) => /* @__PURE__ */ React.createElement("tr", {
    ...headerGroup.getHeaderGroupProps()
  }, headerGroup.headers.map((column) => /* @__PURE__ */ React.createElement("th", {
    ...column.getHeaderProps(column.getSortByToggleProps())
  }, /* @__PURE__ */ React.createElement("p", null, column.render("Header")), /* @__PURE__ */ React.createElement("div", null, column.canFilter ? column.render("Filter") : null), /* @__PURE__ */ React.createElement("span", {
    className: "sortIcon"
  }, column.isSorted ? column.isSortedDesc ? /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faSortDown
  }) : /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faSortUp
  }) : /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faSort
  }))))))), /* @__PURE__ */ React.createElement("tbody", {
    ...getTableBodyProps()
  }, rows.map((row, i) => {
    prepareRow(row);
    return /* @__PURE__ */ React.createElement("tr", {
      ...row.getRowProps()
    }, row.cells.map((cell) => {
      return /* @__PURE__ */ React.createElement("td", {
        ...cell.getCellProps()
      }, cell.render("Cell"));
    }));
  })));
}
function gradeSorting(a, b, columnID) {
  const order = {"+": -1, "-": 1, undefined: 0};
  const ga = a.cells[9].value;
  const gb = b.cells[9].value;
  if ((ga == null || ga == "") && (gb == null || gb == "")) {
    return 0;
  } else if (ga == null || ga == "") {
    return 1;
  } else if (gb == null || gb == "") {
    return -1;
  }
  return ga[0].localeCompare(gb[0]) || order[ga[1]] - order[gb[1]];
}
function DefaultColumnFilter({
  column: {filterValue, preFilteredRows, setFilter}
}) {
  const count = preFilteredRows.length;
  return /* @__PURE__ */ React.createElement("input", {
    value: filterValue || "",
    onChange: (e) => {
      setFilter(e.target.value || void 0);
    },
    placeholder: `Search ${count} records...`
  });
}
function GradebookOverview(props) {
  const {openOverlay, activateMenuPanel} = useToolControlHelper();
  let overviewTable = {};
  overviewTable.headers = [{
    Header: "Name",
    accessor: "name"
  }];
  let assignments = useRecoilValueLoadable(assignmentData);
  if (assignments.state == "hasValue") {
    for (let assignmentId2 in assignments.contents) {
      overviewTable.headers.push({
        Header: /* @__PURE__ */ React.createElement("a", {
          onClick: (e) => {
            e.stopPropagation();
            openOverlay({type: "gradebookassignmentview", title: "Gradebook Assignment View", assignmentId: assignmentId2});
          }
        }, assignments.contents[assignmentId2]),
        accessor: assignmentId2,
        disableFilters: true
      });
    }
  }
  overviewTable.headers.push({
    Header: "Weighted Credt",
    accessor: "weight",
    disableFilters: true
  });
  overviewTable.headers.push({
    Header: "Grade",
    accessor: "grade",
    sortType: gradeSorting,
    disableFilters: true
  });
  overviewTable.rows = [];
  let students = useRecoilValueLoadable(studentData);
  let overView = useRecoilValueLoadable(overViewData);
  if (students.state == "hasValue") {
    for (let userId in students.contents) {
      let firstName = students.contents[userId].firstName, lastName = students.contents[userId].lastName, credit = students.contents[userId].courseCredit, generatedGrade = students.contents[userId].courseGrade, overrideGrade = students.contents[userId].overrideCourseGrade;
      let grade = overrideGrade ? overrideGrade : generatedGrade;
      let row = {};
      row["name"] = firstName + " " + lastName;
      if (overView.state == "hasValue" && assignments.state == "hasValue") {
        for (let assignmentId2 in assignments.contents) {
          row[assignmentId2] = overView.contents[userId].assignments[assignmentId2] * 100 + "%";
        }
      }
      row["weight"] = credit;
      row["grade"] = grade;
      overviewTable.rows.push(row);
    }
  }
  return /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement(Table, {
    columns: overviewTable.headers,
    data: overviewTable.rows
  }));
}
function BackButton(props) {
  return /* @__PURE__ */ React.createElement("button", {
    onClick: () => history.go(-1)
  }, "Courses");
}
function CourseSelector(props) {
  return /* @__PURE__ */ React.createElement("select", {
    onChange: (event) => props.callback(event.target.value)
  }, /* @__PURE__ */ React.createElement("option", {
    value: ""
  }, "Select Course"), props.courseList.map((course, i) => /* @__PURE__ */ React.createElement("option", {
    key: i,
    value: course.courseId
  }, course.longname)));
}
export default function Gradebook(props) {
  let [courseIdVal, setCourseIdVal] = useRecoilState(courseId);
  const history2 = useHistory();
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  useEffect(() => {
    if (urlParamsObj.courseId) {
      setCourseIdVal(urlParamsObj.courseId);
    } else {
      setCourseIdVal("");
    }
  }, [urlParamsObj]);
  console.log("courseId", courseIdVal);
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title: "Gradebook"
  }), /* @__PURE__ */ React.createElement("mainPanel", null, courseIdVal != "" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(BackButton, {
    callback: setCourseIdVal
  }), /* @__PURE__ */ React.createElement(GradebookOverview, null)) : /* @__PURE__ */ React.createElement(DriveCards, {
    types: ["course"],
    subTypes: ["Administrator"],
    routePathDriveId: "",
    driveDoubleClickCallback: ({item}) => {
      let newParams = {};
      newParams["courseId"] = `${item.courseId}`;
      history2.push("?" + encodeParams(newParams));
      setCourseIdVal(item.courseId);
    }
  })));
}
