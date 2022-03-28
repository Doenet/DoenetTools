import React, { useEffect, useRef, useState, Suspense } from 'react';
import styled from 'styled-components';
import { useTable, useSortBy, useFilters, useGlobalFilter } from 'react-table';

import {
  atom,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortUp,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';

import {
  pageToolViewAtom,
  searchParamAtomFamily,
  suppressMenusAtom,
} from '../NewToolRoot';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';

// // React Table Styling
export const Styles = styled.div`
  padding: 1rem;
  table {
    border-collapse: collapse;
    border-spacing: 0;

    thead {
      position: sticky;
      top: 0;
      box-shadow: 0 2px 0 0px #000000;
    }

    a {
      text-decoration: #1a5a99 underline;
    }

    .sortIcon {
      padding-left: 4px;
    }

    tbody tr:not(:last-child) {
      border-bottom: 1px solid #e2e2e2;
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
      background: white;
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
      border-right: 2px solid black;
      :last-child {
        border-right: 0;
      }
    }

    tfoot {
      font-weight: bolder;
      position: sticky;
      bottom: 0;
      background-color: white;
      box-shadow: inset 0 2px 0 #000000;
    }
  }
`;

export const driveId = atom({
  key: 'driveId',
  default: '',
});

const coursesDataQuerry = atom({
  key: 'coursesDataQuerry',
  default: selector({
    key: 'coursesDataQuerry/Default',
    get: async () => {
      try {
        const { data } = await axios.get('/api/loadUserCourses.php');
        return data;
      } catch (error) {
        console.log('Error loading users course list', error.message);
        return {};
      }
    },
  }),
});

const coursesData = selector({
  key: 'coursesData',
  get: ({ get }) => {
    let data = get(coursesDataQuerry);
    return data;
  },
});

const assignmentDataQuerry = atom({
  key: 'assignmentDataQuerry',
  default: selector({
    key: 'assignmentDataQuerry/Default',
    get: async ({ get }) => {
      try {
        const driveId = get(searchParamAtomFamily('driveId'));
        const driveIdPayload = { params: { driveId } };
        const { data } = await axios.get(
          '/api/loadAssignments.php',
          driveIdPayload,
        );

        return data;
      } catch (error) {
        console.log('No assignments associated with drive ID: ', get(driveId));
        return {};
      }
    },
  }),
});

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

export const assignmentData = selector({
  key: 'assignmentData',
  get: ({ get }) => {
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
  set: ({ set, get }, newValue) => {
    //console.log("New Value: ", newValue);
  },
});

export const studentDataQuerry = atom({
  key: 'studentDataQuerry',
  default: selector({
    key: 'studentDataQuerry/Default',
    get: async ({ get }) => {
      const driveId = get(searchParamAtomFamily('driveId'));
      const driveIdPayload = { params: { driveId } };
      try {
        const { data } = await axios.get(
          '/api/loadGradebookEnrollment.php',
          driveIdPayload,
        );
        return data;
      } catch (error) {
        console.log(
          'No students associated with course ID: ',
          get(driveId),
          error,
        );
        return {};
      }
    },
  }),
});

export const studentData = selector({
  key: 'studentData',
  get: ({ get }) => {
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
        role,
      ] = row;

      students[userId] = {
        firstName,
        lastName,
        courseCredit,
        courseGrade,
        overrideCourseGrade,
        role,
      };
    }
    return students;
  },
});

export const overViewDataQuerry = atom({
  key: 'overViewDataQuerry',
  default: selector({
    key: 'overViewDataQuerry/Default',
    get: async ({ get }) => {
      try {
        const driveId = get(searchParamAtomFamily('driveId'));

        const driveIdPayload = { params: { driveId } };
        let { data } = await axios.get(
          '/api/loadGradebookOverview.php',
          driveIdPayload,
        );
        return data;
      } catch (error) {
        console.log(
          'Error loading overview data for courdse ID: ',
          get(driveId),
          error.message,
        );
        return {};
      }
    },
  }),
});

export const overViewData = selector({
  key: 'overViewData',
  get: ({ get }) => {
    const students = get(studentData);
    const assignments = get(assignmentData);
    let overView = {};

    for (let userId in students) {
      overView[userId] = {
        grade: students[userId].courseGrade,
        assignments: {},
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
  },
});

export const attemptDataQuerry = atomFamily({
  key: 'attemptDataQuerry',
  default: selectorFamily({
    key: 'attemptDataQuerry/Default',
    get: (doenetId) => async () => {
      try {
        let doenetIdPayload = { params: { doenetId } };
        let { data } = await axios.get(
          '/api/loadGradebookAssignmentAttempts.php',
          doenetIdPayload,
        );
        return data;
      } catch (error) {
        console.log(
          'Error loading attempts data for doenetId: ',
          doenetId,
          error.message,
        );
        return {};
      }
    },
  }),
});

export const attemptData = selectorFamily({
  key: 'attemptData',
  get:
    (doenetId) =>
    ({ get }) => {
      let attempts = {};

      const students = get(studentData);

      for (let userId in students) {
        attempts[userId] = {
          credit: null,
          creditOverrides: {},
          attempts: {},
        };
      }

      let data = get(attemptDataQuerry(doenetId));
      for (let row of data) {
        let [
          userId,
          attemptNumber,
          assignmentCredit,
          attemptCredit,
          creditOverride,
        ] = row;
        if (attempts[userId]) {
          attempts[userId].credit = assignmentCredit;
          attempts[userId].attempts[attemptNumber] = attemptCredit;
          attempts[userId].creditOverrides[attemptNumber] = creditOverride;
        }
      }

      return attempts;
    },
});

const specificAttemptDataQuerry = atomFamily({
  key: 'specificAttemptDataQuerry',
  default: selectorFamily({
    key: 'specificAttemptDataQuerry/Default',
    get:
      (params) =>
      async ({ get }) => {
        try {
          let assignmentAttemptPayload = { params: params };
          //console.log("payload: ", assignmentAttemptPayload);
          //TODO: Make sure variant is the most recent in content_interactions
          let { data } = await axios.get(
            '/api/loadAssignmentAttempt.php',
            assignmentAttemptPayload,
          );

          return data;
        } catch (error) {
          console.log(
            'Error loading specific attempt data for assignmentId: ',
            assignmentId,
            error.message,
          );
          return {};
        }
      },
  }),
});

export const specificAttemptData = selectorFamily({
  key: 'specificAttemptData',
  get:
    (params) =>
    ({ get }) => {
      let data = get(specificAttemptDataQuerry(params));
      //console.log("debug data: ", data.assignmentAttempted);
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
        doenetML: doenetML,
      };

      return specificAttempt;
    },
});

const doenetMLQuerry = atomFamily({
  key: 'doenetMLQuerry',
  default: selectorFamily({
    key: 'doenetMLQuerry/Default',
    get: (contentId) => async () => {
      try {
        const server = await axios.get(`/media/${contentId}.doenet`);
        return server.data;
      } catch (err) {
        //TODO: Handle 404
        return 'File not found';
      }
    },
  }),
});

// // Table Component
export function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    [],
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [],
  );

  // Use the state and functions returned from useTable to build your UI
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
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy, // useGlobalFilter
  );

  // console.log("footer nonsense", footerGroups[0].headers.map(column => column.Footer));

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                <p>{column.render('Header')}</p>
                <div>{column.canFilter ? column.render('Filter') : null}</div>
                {column.canSort ? (
                  <span className="sortIcon">
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <FontAwesomeIcon icon={faSortDown} />
                      ) : (
                        <FontAwesomeIcon icon={faSortUp} />
                      )
                    ) : (
                      <FontAwesomeIcon icon={faSort} />
                    )}
                  </span>
                ) : null}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>

      <tfoot>
        {/* <tr>

            </tr> */}

        <tr>
          {footerGroups[0].headers.map((column) => (
            <td>
              <p>{column.render('Footer')}</p>
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
}

export function gradeSorting(a, b, columnID) {
  const order = { '+': -1, '-': 1, undefined: 0 };
  const ga = a.cells[9].value;
  const gb = b.cells[9].value;

  if ((ga == null || ga == '') && (gb == null || gb == '')) {
    return 0;
  } else if (ga == null || ga == '') {
    return 1;
  } else if (gb == null || gb == '') {
    return -1;
  }

  return ga[0].localeCompare(gb[0]) || order[ga[1]] - order[gb[1]];
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
      style={{ border: '2px solid black', borderRadius: '5px' }}
    />
  );
}

function GradebookOverview() {
  //const { openOverlay, activateMenuPanel } = useToolControlHelper();
  let driveIdValue = useRecoilValue(driveId);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let students = useRecoilValueLoadable(studentData);
  let assignments = useRecoilValueLoadable(assignmentData);
  let overView = useRecoilValueLoadable(overViewData);
  let effectiveRole = useRecoilValue(effectiveRoleAtom);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);

  useEffect(() => {
    if (effectiveRole === 'student') {
      setSuppressMenus(['GradeDownload']);
    } else {
      setSuppressMenus([]);
    }
  }, [effectiveRole, setSuppressMenus]);
  // console.log(">>>>students",students)
  // console.log(">>>>assignments",assignments)
  // console.log(">>>>overView",overView)

  //Protect from values not being loaded
  if (
    assignments.state !== 'hasValue' ||
    students.state !== 'hasValue' ||
    overView.state !== 'hasValue'
  ) {
    return null;
  }

  let gradeCategories = [
    { category: 'Gateway', scaleFactor: 0 },
    { category: 'Exams' },
    { category: 'Quizzes', maximumNumber: 10 },
    { category: 'Problem sets', maximumNumber: 30 },
    { category: 'Projects' },
    { category: 'Participation' },
  ];

  let overviewTable = {};
  overviewTable.headers = [];
  overviewTable.rows = [];
  let possiblePointRow = {};
  let totalPossiblePoints = 0;

  overviewTable.headers.push({
    Header: 'Name',
    accessor: 'name',
    Footer: 'Possible Points',
  });

  possiblePointRow['name'] = 'Possible Points';

  for (let {
    category,
    scaleFactor = 1,
    maximumNumber = Infinity,
  } of gradeCategories) {
    let allpossiblepoints = [];

    let hasAssignments = false;
    for (let doenetId in assignments.contents) {
      let inCategory = assignments.contents[doenetId].category;
      if (inCategory.toLowerCase() !== category.toLowerCase()) {
        continue;
      }

      hasAssignments = true;

      let possiblepoints =
        assignments.contents[doenetId].totalPointsOrPercent * 1;
      allpossiblepoints.push(possiblepoints);
      // let c = <p>{category}</p>

      overviewTable.headers.push({
        Header: category,
        columns: [
          {
            Header: (
              <a
                style={{
                  display: 'block',
                  fontWeight: 'normal',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
                onClick={(e) => {
                  setPageToolView({
                    page: 'course',
                    tool: 'gradebookAssignment',
                    view: '',
                    params: { driveId: driveIdValue, doenetId },
                  });
                }}
              >
                {assignments.contents[doenetId].label}
              </a>
            ),
            accessor: doenetId,
            Footer: possiblepoints,
            disableFilters: true,
          },
        ],
      });
      possiblePointRow[doenetId] = possiblepoints;
    }
    let numberScores = allpossiblepoints.length;

    allpossiblepoints = allpossiblepoints
      .sort((a, b) => b - a)
      .slice(0, maximumNumber);
    let categoryPossiblePoints =
      allpossiblepoints.reduce((a, c) => a + c, 0) * scaleFactor;

    //category total
    // possiblePointRow[category] = categoryPossiblePoints;
    totalPossiblePoints += categoryPossiblePoints;

    let description = '';
    if (numberScores > maximumNumber) {
      description = (
        <div style={{ fontSize: '.7em' }}>
          (Based on top {maximumNumber} scores)
        </div>
      );
    }
    if (scaleFactor !== 1) {
      description = (
        <div style={{ fontSize: '.7em' }}>
          (Based on rescaling by {scaleFactor * 100}%)
        </div>
      );
    }

    if (hasAssignments) {
      overviewTable.headers.push({
        Header: category,
        columns: [
          {
            Header: (
              <div>
                {`${category} Total`} {description}{' '}
              </div>
            ),
            accessor: category,
            Footer: categoryPossiblePoints,
            disableFilters: true,
          },
        ],
      });
    } else {
      overviewTable.headers.push({
        Header: (
          <div>
            {`${category} Total`} {description}{' '}
          </div>
        ),
        accessor: category,
        Footer: categoryPossiblePoints,
        disableFilters: true,
      });
    }
  }

  overviewTable.headers.push({
    Header: <div>Course Total</div>,
    accessor: 'course total',
    Footer: totalPossiblePoints,
    disableFilters: true,
  });
  // possiblePointRow['course total'] = totalPossiblePoints;

  // overviewTable.rows.push(possiblePointRow)

  for (let userId in students.contents) {
    let firstName = students.contents[userId].firstName,
      lastName = students.contents[userId].lastName,
      role = students.contents[userId].role;
    //TODO: need a switch to filter this in the future
    if (role !== 'Student') {
      continue;
    }

    // let grade = overrideGrade ? overrideGrade : generatedGrade

    let row = {};

    let name = firstName + ' ' + lastName;
    row['name'] = (
      <a
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          setPageToolView({
            page: 'course',
            tool: 'gradebookStudent',
            view: '',
            params: { driveId: driveIdValue, userId },
          });
        }}
      >
        {' '}
        {name}{' '}
      </a>
    );

    let totalScore = 0;

    for (let {
      category,
      scaleFactor = 1,
      maximumNumber = Infinity,
    } of gradeCategories) {
      let scores = [];

      for (let doenetId in assignments.contents) {
        let inCategory = assignments.contents[doenetId].category;
        if (inCategory.toLowerCase() !== category.toLowerCase()) {
          continue;
        }

        let possiblepoints =
          assignments.contents[doenetId].totalPointsOrPercent * 1;
        let credit = overView.contents[userId].assignments[doenetId];
        let score = possiblepoints * credit;

        scores.push(score);

        score = Math.round(score * 100) / 100;
        row[doenetId] = (
          <a
            onClick={(e) => {
              setPageToolView({
                page: 'course',
                tool: 'gradebookStudentAssignment',
                view: '',
                params: {
                  driveId: driveIdValue,
                  doenetId,
                  userId,
                  previousCrumb: 'student',
                },
              });
            }}
          >
            {score}
          </a>
        );
        // row[doenetId] = score;
      }

      // let numberScores = scores.length;
      scores = scores.sort((a, b) => b - a).slice(0, maximumNumber);
      let categoryScore = scores.reduce((a, c) => a + c, 0) * scaleFactor;

      totalScore += categoryScore;

      categoryScore = Math.round(categoryScore * 100) / 100;
      row[category] = categoryScore;
    }

    totalScore = Math.round(totalScore * 100) / 100;
    row['course total'] = totalScore;

    overviewTable.rows.push(row);
  }

  // getTrProps = (row) => {
  //     if (rowInfo) {
  //       return {
  //         style: {
  //           background: rowInfo.row.age > 20 ? 'red' : 'green',
  //           color: 'white'
  //         }
  //       }
  //     }
  //     return {};
  //   }

  console.log('rows', overviewTable.rows);
  return (
    <Styles>
      <Table
        columns={overviewTable.headers}
        data={overviewTable.rows}
        // getRowProps={row => ({
        //     style: {
        //       backgroundColor: overviewTable.rows[0]['name'] === "Possible Points" ? '#e2e2e2' : 'white',
        //     },
        //   })}
      />
    </Styles>
  );
}

export default function Gradebook(props) {
  // let specificAttempt = useRecoilValueLoadable(specificAttemptData({doenetId: 'ass1', userId: 'temp1', attemptNumber: 1}))

  // if(specificAttempt.state === 'hasValue'){
  //     console.log(">>> specificAttempt", specificAttempt.contents)
  // }else{
  //     console.log(">>> specificAttempt", specificAttempt.state)
  // }

  // return(
  //     <p>Test</p>
  // )

  // let [driveIdVal, setDriveIdVal] = useRecoilState(driveId);
  // const history = useHistory();
  // let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));

  // useEffect(()=>{
  //     if(urlParamsObj.driveId){
  //         setDriveIdVal(urlParamsObj.driveId);
  //     }else{
  //         setDriveIdVal('');
  //     }
  //   },[urlParamsObj]);
  // let courseList = useRecoilValueLoadable(coursesData);
  // console.log(courseList.contents)

  //console.log(">>> driveId", driveIdVal);

  const setDriveId = useSetRecoilState(driveId);

  setDriveId(useRecoilValue(searchParamAtomFamily('driveId')));

  //console.log("driveId: ", useRecoilValue(driveId))
  return <GradebookOverview />;
}
