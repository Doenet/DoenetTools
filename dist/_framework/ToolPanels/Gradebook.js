import React, {useEffect, useRef, useState, Suspense} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {useTable, useSortBy, useFilters, useGlobalFilter} from "../../_snowpack/pkg/react-table.js";
import {
  atom,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import axios from "../../_snowpack/pkg/axios.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faSort, faSortUp, faSortDown} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import {use} from "../../_snowpack/pkg/chai.js";
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
export const driveId = atom({
  key: "driveId",
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
        const driveId2 = get(searchParamAtomFamily("driveId"));
        const driveIdPayload = {params: {driveId: driveId2}};
        const {data} = await axios.get("/api/loadAssignments.php", driveIdPayload);
        return data;
      } catch (error) {
        console.log("No assignments associated with drive ID: ", get(driveId));
        return {};
      }
    }
  })
});
export const assignmentData = selector({
  key: "assignmentData",
  get: ({get}) => {
    let assignmentArray = {};
    let data = get(assignmentDataQuerry);
    for (let row of data) {
      let [doenetId, assignmentName] = row;
      assignmentArray[doenetId] = assignmentName;
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
      const driveId2 = get(searchParamAtomFamily("driveId"));
      const driveIdPayload = {params: {driveId: driveId2}};
      try {
        const {data} = await axios.get("/api/loadGradebookEnrollment.php", driveIdPayload);
        return data;
      } catch (error) {
        console.log("No students associated with course ID: ", get(driveId2), error);
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
        overrideCourseGrade,
        role
      ] = row;
      students[userId] = {
        firstName,
        lastName,
        courseCredit,
        courseGrade,
        overrideCourseGrade,
        role
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
        const driveId2 = get(searchParamAtomFamily("driveId"));
        const driveIdPayload = {params: {driveId: driveId2}};
        let {data} = await axios.get("/api/loadGradebookOverview.php", driveIdPayload);
        return data;
      } catch (error) {
        console.log("Error loading overview data for courdse ID: ", get(driveId), error.message);
        return {};
      }
    }
  })
});
export const overViewData = selector({
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
      for (let doenetId in assignments) {
        overView[userId].assignments[doenetId] = null;
      }
    }
    let data = get(overViewDataQuerry);
    for (let userAssignment in data) {
      let [
        doenetId,
        credit,
        userId
      ] = data[userAssignment];
      overView[userId].assignments[doenetId] = credit;
    }
    return overView;
  }
});
const attemptDataQuerry = atomFamily({
  key: "attemptDataQuerry",
  default: selectorFamily({
    key: "attemptDataQuerry/Default",
    get: (doenetId) => async () => {
      try {
        let doenetIdPayload = {params: {doenetId}};
        let {data} = await axios.get("/api/loadGradebookAssignmentAttempts.php", doenetIdPayload);
        return data;
      } catch (error) {
        console.log("Error loading attempts data for doenetId: ", doenetId, error.message);
        return {};
      }
    }
  })
});
export const attemptData = selectorFamily({
  key: "attemptData",
  get: (doenetId) => ({get}) => {
    let attempts = {};
    const students = get(studentData);
    for (let userId in students) {
      attempts[userId] = {
        credit: null,
        attempts: {}
      };
    }
    let data = get(attemptDataQuerry(doenetId));
    for (let row of data) {
      let [
        userId,
        attemptNumber,
        assignmentCredit,
        attemptCredit
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
    let doenetML = get(doenetMLQuerry(data.contentId));
    let specificAttempt = {
      assignmentAttempted: data.assignmentAttempted,
      stateVariables: data.stateVariables,
      variant: data.variant,
      interactionSource: data.interactionSource,
      assignmentCredit: data.assignmentCredit,
      assignmentCreditOverride: data.assignmentCreditOverride,
      attemptCredit: data.attemptCredit,
      attemptCreditOverride: data.attemptCreditOverride,
      timestamp: data.timestamp,
      doenetML
    };
    return specificAttempt;
  }
});
const doenetMLQuerry = atomFamily({
  key: "doenetMLQuerry",
  default: selectorFamily({
    key: "doenetMLQuerry/Default",
    get: (contentId) => async () => {
      try {
        const server = await axios.get(`/media/${contentId}.doenet`);
        return server.data;
      } catch (err) {
        return "File not found";
      }
    }
  })
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
  }, /* @__PURE__ */ React.createElement("p", null, column.render("Header")), /* @__PURE__ */ React.createElement("div", null, column.canFilter ? column.render("Filter") : null), column.canSort ? /* @__PURE__ */ React.createElement("span", {
    className: "sortIcon"
  }, column.isSorted ? column.isSortedDesc ? /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faSortDown
  }) : /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faSortUp
  }) : /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faSort
  })) : null))))), /* @__PURE__ */ React.createElement("tbody", {
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
export function gradeSorting(a, b, columnID) {
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
const getUserId = (students, name) => {
  for (let userId in students) {
    if (students[userId].firstName + " " + students[userId].lastName == name) {
      return userId;
    }
  }
  return -1;
};
function GradebookOverview(props) {
  let driveIdValue = useRecoilValue(driveId);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let students = useRecoilValueLoadable(studentData);
  let overviewTable = {};
  overviewTable.headers = [];
  if (students.state == "hasValue") {
    overviewTable.headers.push({
      Header: "Name",
      accessor: "name",
      Cell: (row) => /* @__PURE__ */ React.createElement("a", {
        onClick: (e) => {
          let name = row.cell.row.cells[0].value;
          let userId = getUserId(students.contents, name);
          setPageToolView({
            page: "course",
            tool: "gradebookStudent",
            view: "",
            params: {driveId: driveIdValue, userId}
          });
        }
      }, " ", row.cell.row.cells[0].value, " ")
    });
  }
  let assignments = useRecoilValueLoadable(assignmentData);
  if (assignments.state == "hasValue") {
    for (let doenetId in assignments.contents) {
      overviewTable.headers.push({
        Header: /* @__PURE__ */ React.createElement("a", {
          onClick: (e) => {
            e.stopPropagation();
            setPageToolView({
              page: "course",
              tool: "gradebookAssignment",
              view: "",
              params: {driveId: driveIdValue, doenetId}
            });
          }
        }, assignments.contents[doenetId].label),
        accessor: doenetId,
        disableFilters: true
      });
    }
  }
  overviewTable.headers.push({
    Header: "Grade",
    accessor: "grade",
    sortType: gradeSorting,
    disableFilters: true
  });
  overviewTable.rows = [];
  let overView = useRecoilValueLoadable(overViewData);
  if (students.state == "hasValue") {
    for (let userId in students.contents) {
      let firstName = students.contents[userId].firstName, lastName = students.contents[userId].lastName, generatedGrade = students.contents[userId].courseGrade, overrideGrade = students.contents[userId].overrideCourseGrade, role = students.contents[userId].role;
      if (role !== "Student") {
        continue;
      }
      let grade = overrideGrade ? overrideGrade : generatedGrade;
      let row = {};
      row["name"] = firstName + " " + lastName;
      if (overView.state == "hasValue" && assignments.state == "hasValue") {
        for (let doenetId in assignments.contents) {
          row[doenetId] = Math.round(overView.contents[userId].assignments[doenetId] * 1e4) / 100 + "%";
        }
      }
      row["grade"] = grade;
      overviewTable.rows.push(row);
    }
  }
  return /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement(Table, {
    columns: overviewTable.headers,
    data: overviewTable.rows
  }));
}
export default function Gradebook(props) {
  const setDriveId = useSetRecoilState(driveId);
  setDriveId(useRecoilValue(searchParamAtomFamily("driveId")));
  return /* @__PURE__ */ React.createElement(GradebookOverview, null);
}
