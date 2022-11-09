import React, {useEffect} from "../../_snowpack/pkg/react.js";
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
import {coursePermissionsAndSettingsByCourseId} from "../../_reactComponents/Course/CourseActions.js";
export const Styles = styled.div`
  padding: 1rem;
  table {
    /* border-collapse: collapse; */
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

    /* th > p {
      height: 100%;
    } */

    tr:first-child th > p {
      margin: 0px 0px 4px 0px;
      padding: 0px;
    }

    tr:not(:first-child) th:not(:first-child) > p {
      writing-mode: vertical-rl;
      text-align: left;
      transform: rotate(180deg);
      max-height: 160px;
    }

    thead tr:only-child th:not(:first-child) > p {
      writing-mode: vertical-rl;
      text-align: left;
      transform: rotate(180deg);
      max-height: 160px;
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
const assignmentDataQuery = atom({
  key: "assignmentDataQuery",
  default: selector({
    key: "assignmentDataQuery/Default",
    get: async ({get}) => {
      const courseId = get(searchParamAtomFamily("courseId"));
      try {
        const {
          data: {success, message, assignments}
        } = await axios.get("/api/loadGradebookAssignments.php", {
          params: {courseId}
        });
        if (success) {
          return assignments;
        }
        throw new Error(message);
      } catch (error) {
        console.warn("No assignments associated with courseId ID: ", courseId);
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
    let data = get(assignmentDataQuery);
    if (isIterable(data)) {
      for (let row of data) {
        let [doenetId, assignmentInfo] = row;
        assignmentArray[doenetId] = assignmentInfo;
      }
    }
    return assignmentArray;
  }
});
export const studentDataQuery = atom({
  key: "studentDataQuery",
  default: selector({
    key: "studentDataQuery/Default",
    get: async ({get}) => {
      const courseId = get(searchParamAtomFamily("courseId"));
      try {
        const {
          data: {success, message, gradebookEnrollment}
        } = await axios.get("/api/loadGradebookEnrollment.php", {
          params: {courseId}
        });
        if (success) {
          return gradebookEnrollment;
        }
        throw new Error(message);
      } catch (error) {
        console.warn("No students associated with course ID: ", courseId, error);
        return [];
      }
    }
  })
});
export const studentData = selector({
  key: "studentData",
  get: ({get}) => {
    let data = get(studentDataQuery);
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
export const overviewDataQuery = atom({
  key: "overviewDataQuery",
  default: selector({
    key: "overviewDataQuery/Default",
    get: async ({get}) => {
      const courseId = get(searchParamAtomFamily("courseId"));
      try {
        let {
          data: {success, message, overview}
        } = await axios.get("/api/loadGradebookOverview.php", {
          params: {courseId}
        });
        if (success) {
          return overview;
        }
        throw new Error(message);
      } catch (error) {
        console.warn(error.message);
        return {};
      }
    }
  })
});
export const overviewData = selector({
  key: "overviewData",
  get: ({get}) => {
    const students = get(studentData);
    const assignments = get(assignmentData);
    let overview = {};
    for (let userId in students) {
      overview[userId] = {
        grade: students[userId].courseGrade,
        assignments: {}
      };
      for (let doenetId in assignments) {
        overview[userId].assignments[doenetId] = null;
      }
    }
    let data = get(overviewDataQuery);
    for (let userAssignment of data) {
      let [doenetId, credit, userId] = userAssignment;
      if (overview[userId]) {
        overview[userId].assignments[doenetId] = credit;
      }
    }
    return overview;
  }
});
export const attemptDataQuery = atomFamily({
  key: "attemptDataQuery",
  default: selectorFamily({
    key: "attemptDataQuery/Default",
    get: (doenetId) => async ({get}) => {
      const courseId = get(searchParamAtomFamily("courseId"));
      try {
        let {
          data: {success, message, assignmentAttemptsData}
        } = await axios.get("/api/loadGradebookAssignmentAttempts.php", {
          params: {courseId, doenetId}
        });
        if (success) {
          return assignmentAttemptsData;
        }
        throw new Error(message);
      } catch (error) {
        console.warn("Error loading attempts data for doenetId: ", doenetId, error.message);
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
    let data = get(attemptDataQuery(doenetId));
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
const specificAttemptDataQuery = atomFamily({
  key: "specificAttemptDataQuery",
  default: selectorFamily({
    key: "specificAttemptDataQuery/Default",
    get: (params) => async () => {
      try {
        let {
          data: {success, message, attemptData: attemptData2}
        } = await axios.get("/api/loadAssignmentAttempt.php", {...params});
        if (success) {
          return attemptData2;
        } else {
          throw new Error(message);
        }
      } catch (error) {
        console.warn("Error loading specific attempt data for assignmentId: ", params?.doenetId, error.message);
        return {};
      }
    }
  })
});
export const specificAttemptData = selectorFamily({
  key: "specificAttemptData",
  get: (params) => ({get}) => {
    let data = get(specificAttemptDataQuery(params));
    let doenetML = get(doenetMLQuery(data.contentId));
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
const doenetMLQuery = atomFamily({
  key: "doenetMLQuery",
  default: selectorFamily({
    key: "doenetMLQuery/Default",
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
    prepareRow
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
  }, rows.map((row) => {
    prepareRow(row);
    return /* @__PURE__ */ React.createElement("tr", {
      ...row.getRowProps()
    }, row.cells.map((cell) => {
      return /* @__PURE__ */ React.createElement("td", {
        ...cell.getCellProps()
      }, cell.render("Cell"));
    }));
  })), /* @__PURE__ */ React.createElement("tfoot", null, /* @__PURE__ */ React.createElement("tr", null, footerGroups[0].headers.map((column) => /* @__PURE__ */ React.createElement("td", {
    ...column.getFooterProps()
  }, /* @__PURE__ */ React.createElement("p", null, column.render("Footer")))))));
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
export const gradeCategories = [
  {category: "Gateway", scaleFactor: 0},
  {category: "Exams"},
  {category: "Quizzes", maximumNumber: 10},
  {category: "Problem sets", maximumNumber: 30},
  {category: "Projects"},
  {category: "Participation", maximumValue: 50}
];
function GradebookOverview() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let students = useRecoilValueLoadable(studentData);
  let assignments = useRecoilValueLoadable(assignmentData);
  let overview = useRecoilValueLoadable(overviewData);
  let {canViewAndModifyGrades} = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  useEffect(() => {
    setSuppressMenus(canViewAndModifyGrades === "1" ? [] : ["GradeDownload"]);
  }, [canViewAndModifyGrades, setSuppressMenus]);
  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  if (course?.canViewCourse == "0") {
    return /* @__PURE__ */ React.createElement("h1", null, "No Access to view this page.");
  }
  if (assignments.state !== "hasValue" || students.state !== "hasValue" || overview.state !== "hasValue") {
    return null;
  }
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
  let sortedAssignments = Object.entries(assignments.contents);
  sortedAssignments.sort((a, b) => a[1].sortOrder < b[1].sortOrder ? -1 : 1);
  possiblePointRow["name"] = "Possible Points";
  for (let {
    category,
    scaleFactor = 1,
    maximumNumber = Infinity,
    maximumValue = Infinity
  } of gradeCategories) {
    let allpossiblepoints = [];
    let hasAssignments = false;
    for (let [doenetId] of sortedAssignments) {
      let inCategory = assignments.contents[doenetId].category;
      if (inCategory?.toLowerCase() !== category.toLowerCase()) {
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
              onClick: () => {
                setPageToolView({
                  page: "course",
                  tool: "gradebookAssignment",
                  view: "",
                  params: {courseId, doenetId}
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
    let scaledPossiblePoints = allpossiblepoints.reduce((a, c) => a + c, 0) * scaleFactor;
    let categoryPossiblePoints = Math.min(scaledPossiblePoints, maximumValue);
    totalPossiblePoints += categoryPossiblePoints;
    categoryPossiblePoints = Math.round(categoryPossiblePoints * 100) / 100;
    let description = [];
    if (numberScores > maximumNumber) {
      description.push(`top ${maximumNumber} scores`);
    }
    if (scaleFactor !== 1) {
      description.push(`rescaling by ${scaleFactor * 100}%`);
    }
    if (scaledPossiblePoints > maximumValue) {
      description.push(`a cap of ${maximumValue} points`);
    }
    if (hasAssignments) {
      overviewTable.headers.push({
        Header: category,
        columns: [
          {
            Header: /* @__PURE__ */ React.createElement("div", null, `${category} Total`, " ", description.length > 0 && /* @__PURE__ */ React.createElement("div", {
              style: {fontSize: ".7em"}
            }, "Based on ", description.join(","))),
            accessor: category,
            Footer: categoryPossiblePoints,
            disableFilters: true
          }
        ]
      });
    } else {
      overviewTable.headers.push({
        Header: /* @__PURE__ */ React.createElement("div", null),
        accessor: category,
        Footer: categoryPossiblePoints,
        disableFilters: true
      });
    }
  }
  totalPossiblePoints = Math.round(totalPossiblePoints * 100) / 100;
  overviewTable.headers.push({
    Header: /* @__PURE__ */ React.createElement("div", null, "Course Total"),
    accessor: "course total",
    Footer: totalPossiblePoints,
    disableFilters: true
  });
  for (let userId in students.contents) {
    let firstName = students.contents[userId].firstName, lastName = students.contents[userId].lastName;
    let row = {};
    let name = firstName + " " + lastName;
    row["name"] = /* @__PURE__ */ React.createElement("a", {
      style: {cursor: "pointer"},
      onClick: () => {
        setPageToolView({
          page: "course",
          tool: "gradebookStudent",
          view: "",
          params: {courseId, userId}
        });
      }
    }, " ", name, " ");
    let totalScore = 0;
    for (let {
      category,
      scaleFactor = 1,
      maximumNumber = Infinity,
      maximumValue = Infinity
    } of gradeCategories) {
      let scores = [];
      for (let [doenetId] of sortedAssignments) {
        let inCategory = assignments.contents[doenetId].category;
        if (inCategory?.toLowerCase() !== category.toLowerCase()) {
          continue;
        }
        let possiblepoints = assignments.contents[doenetId].totalPointsOrPercent * 1;
        let credit = overview.contents[userId].assignments[doenetId];
        let score = possiblepoints * credit;
        scores.push(score);
        score = Math.round(score * 100) / 100;
        row[doenetId] = /* @__PURE__ */ React.createElement("a", {
          onClick: () => {
            setPageToolView({
              page: "course",
              tool: "gradebookStudentAssignment",
              view: "",
              params: {
                courseId,
                doenetId,
                userId,
                previousCrumb: "student"
              }
            });
          },
          role: "button"
        }, score);
      }
      scores = scores.sort((a, b) => b - a).slice(0, maximumNumber);
      let scaledScore = scores.reduce((a, c) => a + c, 0) * scaleFactor;
      let categoryScore = Math.min(scaledScore, maximumValue);
      totalScore += categoryScore;
      categoryScore = Math.round(categoryScore * 100) / 100;
      row[category] = categoryScore;
    }
    totalScore = Math.round(totalScore * 100) / 100;
    row["course total"] = totalScore;
    overviewTable.rows.push(row);
  }
  return /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement(Table, {
    columns: overviewTable.headers,
    data: overviewTable.rows
  }));
}
export default function Gradebook() {
  return /* @__PURE__ */ React.createElement(GradebookOverview, null);
}
