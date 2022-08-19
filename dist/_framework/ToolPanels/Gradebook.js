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
import {
  faSort,
  faSortUp,
  faSortDown
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {
  pageToolViewAtom,
  searchParamAtomFamily,
  suppressMenusAtom
} from "../NewToolRoot.js";
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
export const Styles = styled.div`
  padding: 1rem;
  table {
    border-collapse: collapse;
    border-spacing: 0;

    thead {
      position: sticky;
      top: 0;
      box-shadow: 0 2px 0 0px var(--canvastext);
    }

    a {
      text-decoration: var(--mainBlue) underline;
    }

    .sortIcon {
      padding-left: 4px;
    }

    tbody tr:not(:last-child) {
      border-bottom: 1px solid var(--mainGray);
    }

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
      background: var(--canvas);
      user-select: none;
      max-width: 4rem;
      //word-wrap: break-word;
      padding: 2px;
      max-height: 10rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
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

    tr:not(:first-child) th:not(:first-child) > p {
      writing-mode: vertical-rl;
      text-align: left;
      transform: rotate(180deg);
    }

    thead tr:only-child th:not(:first-child) > p {
      writing-mode: vertical-rl;
      text-align: left;
      transform: rotate(180deg);
    }

    td {
      /* user-select: none; */
      text-align: center;
      max-width: 5rem;
    }
    td,
    th {
      border-right: 2px solid var(--canvastext);
      :last-child {
        border-right: 0;
      }
    }

    tfoot {
      font-weight: bolder;
      position: sticky;
      bottom: 0;
      background-color: var(--canvas);
      box-shadow: inset 0 2px 0 var(--canvastext);
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
        const courseId = get(searchParamAtomFamily("courseId"));
        const driveIdPayload = {params: {driveId: courseId}};
        const {data} = await axios.get("/api/loadAssignments.php", driveIdPayload);
        return data;
      } catch (error) {
        console.log("No assignments associated with drive ID: ", get(driveId));
        return {};
      }
    }
  })
});
function isIterable(obj) {
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === "function";
}
export const assignmentData = selector({
  key: "assignmentData",
  get: ({get}) => {
    let assignmentArray = {};
    let data = get(assignmentDataQuerry);
    if (isIterable(data)) {
      for (let row of data) {
        let [doenetId, assignmentName] = row;
        assignmentArray[doenetId] = assignmentName;
      }
    }
    return assignmentArray;
  },
  set: ({set, get}, newValue) => {
  }
});
export const studentDataQuerry = atom({
  key: "studentDataQuerry",
  default: selector({
    key: "studentDataQuerry/Default",
    get: async ({get}) => {
      const courseId = get(searchParamAtomFamily("courseId"));
      const driveIdPayload = {params: {driveId: courseId}};
      try {
        const {data} = await axios.get("/api/loadGradebookEnrollment.php", driveIdPayload);
        return data;
      } catch (error) {
        console.log("No students associated with course ID: ", get(driveId), error);
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
export const overViewDataQuerry = atom({
  key: "overViewDataQuerry",
  default: selector({
    key: "overViewDataQuerry/Default",
    get: async ({get}) => {
      try {
        const courseId = get(searchParamAtomFamily("courseId"));
        const driveIdPayload = {params: {driveId: courseId}};
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
      let [doenetId, credit, userId] = data[userAssignment];
      if (overView[userId]) {
        overView[userId].assignments[doenetId] = credit;
      }
    }
    return overView;
  }
});
export const attemptDataQuerry = atomFamily({
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
        creditOverrides: {},
        attempts: {}
      };
    }
    let data = get(attemptDataQuerry(doenetId));
    for (let row of data) {
      let [
        userId,
        attemptNumber,
        assignmentCredit,
        attemptCredit,
        creditOverride
      ] = row;
      if (attempts[userId]) {
        attempts[userId].credit = assignmentCredit;
        attempts[userId].attempts[attemptNumber] = attemptCredit;
        attempts[userId].creditOverrides[attemptNumber] = creditOverride;
      }
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
    footerGroups,
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
  })), /* @__PURE__ */ React.createElement("tfoot", null, /* @__PURE__ */ React.createElement("tr", null, footerGroups[0].headers.map((column) => /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("p", null, column.render("Footer")))))));
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
    placeholder: `Search ${count} records...`,
    style: {border: "2px solid var(--canvastext)", borderRadius: "5px"}
  });
}
function GradebookOverview() {
  let driveIdValue = useRecoilValue(driveId);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let students = useRecoilValueLoadable(studentData);
  let assignments = useRecoilValueLoadable(assignmentData);
  let overView = useRecoilValueLoadable(overViewData);
  let {canViewAndModifyGrades} = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  useEffect(() => {
    setSuppressMenus(canViewAndModifyGrades === "1" ? [] : ["GradeDownload"]);
  }, [canViewAndModifyGrades, setSuppressMenus]);
  if (assignments.state !== "hasValue" || students.state !== "hasValue" || overView.state !== "hasValue") {
    return null;
  }
  let gradeCategories = [
    {category: "Gateway", scaleFactor: 0},
    {category: "Exams"},
    {category: "Quizzes", maximumNumber: 10},
    {category: "Problem sets", maximumNumber: 30},
    {category: "Projects"},
    {category: "Participation"}
  ];
  let overviewTable = {};
  overviewTable.headers = [];
  overviewTable.rows = [];
  let possiblePointRow = {};
  let totalPossiblePoints = 0;
  overviewTable.headers.push({
    Header: "Name",
    accessor: "name",
    Footer: "Possible Points"
  });
  possiblePointRow["name"] = "Possible Points";
  for (let {
    category,
    scaleFactor = 1,
    maximumNumber = Infinity
  } of gradeCategories) {
    let allpossiblepoints = [];
    let hasAssignments = false;
    for (let doenetId in assignments.contents) {
      let inCategory = assignments.contents[doenetId].category;
      if (inCategory.toLowerCase() !== category.toLowerCase()) {
        continue;
      }
      hasAssignments = true;
      let possiblepoints = assignments.contents[doenetId].totalPointsOrPercent * 1;
      allpossiblepoints.push(possiblepoints);
      overviewTable.headers.push({
        Header: category,
        columns: [
          {
            Header: /* @__PURE__ */ React.createElement("a", {
              style: {
                display: "block",
                fontWeight: "normal",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
              },
              onClick: (e) => {
                setPageToolView({
                  page: "course",
                  tool: "gradebookAssignment",
                  view: "",
                  params: {driveId: driveIdValue, doenetId}
                });
              }
            }, assignments.contents[doenetId].label),
            accessor: doenetId,
            Footer: possiblepoints,
            disableFilters: true
          }
        ]
      });
      possiblePointRow[doenetId] = possiblepoints;
    }
    let numberScores = allpossiblepoints.length;
    allpossiblepoints = allpossiblepoints.sort((a, b) => b - a).slice(0, maximumNumber);
    let categoryPossiblePoints = allpossiblepoints.reduce((a, c) => a + c, 0) * scaleFactor;
    totalPossiblePoints += categoryPossiblePoints;
    let description = "";
    if (numberScores > maximumNumber) {
      description = /* @__PURE__ */ React.createElement("div", {
        style: {fontSize: ".7em"}
      }, "(Based on top ", maximumNumber, " scores)");
    }
    if (scaleFactor !== 1) {
      description = /* @__PURE__ */ React.createElement("div", {
        style: {fontSize: ".7em"}
      }, "(Based on rescaling by ", scaleFactor * 100, "%)");
    }
    if (hasAssignments) {
      overviewTable.headers.push({
        Header: category,
        columns: [
          {
            Header: /* @__PURE__ */ React.createElement("div", null, `${category} Total`, " ", description, " "),
            accessor: category,
            Footer: categoryPossiblePoints,
            disableFilters: true
          }
        ]
      });
    } else {
      overviewTable.headers.push({
        Header: /* @__PURE__ */ React.createElement("div", null, `${category} Total`, " ", description, " "),
        accessor: category,
        Footer: categoryPossiblePoints,
        disableFilters: true
      });
    }
  }
  overviewTable.headers.push({
    Header: /* @__PURE__ */ React.createElement("div", null, "Course Total"),
    accessor: "course total",
    Footer: totalPossiblePoints,
    disableFilters: true
  });
  for (let userId in students.contents) {
    let firstName = students.contents[userId].firstName, lastName = students.contents[userId].lastName, role = students.contents[userId].role;
    if (role !== "Student") {
      continue;
    }
    let row = {};
    let name = firstName + " " + lastName;
    row["name"] = /* @__PURE__ */ React.createElement("a", {
      style: {cursor: "pointer"},
      onClick: (e) => {
        setPageToolView({
          page: "course",
          tool: "gradebookStudent",
          view: "",
          params: {driveId: driveIdValue, userId}
        });
      }
    }, " ", name, " ");
    let totalScore = 0;
    for (let {
      category,
      scaleFactor = 1,
      maximumNumber = Infinity
    } of gradeCategories) {
      let scores = [];
      for (let doenetId in assignments.contents) {
        let inCategory = assignments.contents[doenetId].category;
        if (inCategory.toLowerCase() !== category.toLowerCase()) {
          continue;
        }
        let possiblepoints = assignments.contents[doenetId].totalPointsOrPercent * 1;
        let credit = overView.contents[userId].assignments[doenetId];
        let score = possiblepoints * credit;
        scores.push(score);
        score = Math.round(score * 100) / 100;
        row[doenetId] = /* @__PURE__ */ React.createElement("a", {
          onClick: (e) => {
            setPageToolView({
              page: "course",
              tool: "gradebookStudentAssignment",
              view: "",
              params: {
                driveId: driveIdValue,
                doenetId,
                userId,
                previousCrumb: "student"
              }
            });
          }
        }, score);
      }
      scores = scores.sort((a, b) => b - a).slice(0, maximumNumber);
      let categoryScore = scores.reduce((a, c) => a + c, 0) * scaleFactor;
      totalScore += categoryScore;
      categoryScore = Math.round(categoryScore * 100) / 100;
      row[category] = categoryScore;
    }
    totalScore = Math.round(totalScore * 100) / 100;
    row["course total"] = totalScore;
    overviewTable.rows.push(row);
  }
  console.log("rows", overviewTable.rows);
  return /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement(Table, {
    columns: overviewTable.headers,
    data: overviewTable.rows
  }));
}
export default function Gradebook(props) {
  const setDriveId = useSetRecoilState(driveId);
  setDriveId(useRecoilValue(searchParamAtomFamily("courseId")));
  return /* @__PURE__ */ React.createElement(GradebookOverview, null);
}
