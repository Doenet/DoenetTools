/**
 * External dependencies
 */
import React, { useState } from 'react';
import {
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
  atom,
} from 'recoil';
/**
 * Internal dependencies
 */
import { pageToolViewAtom } from '../NewToolRoot';
import {
  selectedDriveAtom,
  selectedDriveItems,
  itemType,
  clearDriveAndItemSelections,
} from '../../../_reactComponents/Drive/NewDrive';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faLessThan,
//   faGreaterThan
// } from '@fortawesome/free-solid-svg-icons';

// import { DropTargetsProvider } from '../../../_reactComponents/DropTarget';
// import { BreadcrumbProvider } from '../../../_reactComponents/Breadcrumb/BreadcrumbProvider';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import axios from 'axios';
import Checkbox from '../../../_reactComponents/PanelHeaderComponents/Checkbox';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { UTCDateStringToDate } from '../../../_utils/dateUtilityFunction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faThumbtack,
} from '@fortawesome/free-solid-svg-icons';
import { findFirstPageOfActivity, itemByDoenetId, useInitCourseItems } from '../../../_reactComponents/Course/CourseActions';

//array of objects
//dotwIndex as a number starting at 0 for Sunday (the js standard)
//startTime as text "01:00"
//endTime as text "02:00"
export const classTimesAtom = atom({
  key: 'classTimesAtom',
  default: [],
});

//boolean
export const showCompletedAtom = atom({
  key: 'showCompletedAtom',
  default: true,
});
//boolean
export const showOverdueAtom = atom({
  key: 'showOverdueAtom',
  default: false,
});

function formatAssignedDate(dt, classTimes, dueDT, thisWeek) {
  //If we don't have a dt datetime then return null
  if (dt == 'Invalid Date' || dt == null) {
    return null;
  }
  //After Class and In Class
  let dtDOTW = dt.getDay();
  for (let classTime of classTimes) {
    //Only process if it's the right day of the week
    if (classTime.dotwIndex == dtDOTW) {
      let classStartDT = new Date(dt.getTime());
      const [starthours, startminutes] = classTime.startTime.split(':');
      classStartDT.setHours(starthours, startminutes, 0, 0);
      let classEndDT = new Date(dt.getTime());
      const [endhours, endminutes] = classTime.endTime.split(':');
      classEndDT.setHours(endhours, endminutes, 0, 0);

      if (dt >= classStartDT && dt < classEndDT) {
        if (
          dt.getMonth() != dueDT.getMonth() ||
          dt.getDate() != dueDT.getDate()
        ) {
          return `In Class ${dt.getMonth() + 1}/${dt.getDate()}`;
        }

        return 'In Class';
      } else if (dt.getTime() == classEndDT.getTime()) {
        if (
          dt.getMonth() != dueDT.getMonth() ||
          dt.getDate() != dueDT.getDate()
        ) {
          return `After Class ${dt.getMonth() + 1}/${dt.getDate()}`;
        }
        return 'After Class';
      }
    }
  }

  let time = dt.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  if (time === 'Invalid Date') {
    time = null;
  }

  //This week only
  if (thisWeek) {
    let today = new Date();
    let yesterday = new Date(today.getTime() + 1000 * 60 * 60 * 24 * -1);
    let tomorrow = new Date(today.getTime() + 1000 * 60 * 60 * 24 * 1);

    //Yesterday - time
    if (
      dt.getMonth() == yesterday.getMonth() &&
      dt.getDate() == yesterday.getDate() &&
      dt.getFullYear() == yesterday.getFullYear()
    ) {
      return `Yesterday - ${time}`;
    }

    if (
      dt.getMonth() == tomorrow.getMonth() &&
      dt.getDate() == tomorrow.getDate() &&
      dt.getFullYear() == tomorrow.getFullYear()
    ) {
      return `Tomorrow - ${time}`;
    }

    //Day of the Week
    const dotwLabel = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
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
  if (dt == 'Invalid Date' || dt == null) {
    return null;
  }

  //End of Class, In Class, and Before Class
  let dtDOTW = dt.getDay();
  for (let classTime of classTimes) {
    //Only process if it's the right day of the week
    if (classTime.dotwIndex == dtDOTW) {
      let classStartDT = new Date(dt.getTime());
      const [starthours, startminutes] = classTime.startTime.split(':');
      classStartDT.setHours(starthours, startminutes, 0, 0);
      let classEndDT = new Date(dt.getTime());
      const [endhours, endminutes] = classTime.endTime.split(':');
      classEndDT.setHours(endhours, endminutes, 0, 0);
      if (dt.getTime() == classStartDT.getTime()) {
        return 'Before Class';
      } else if (dt > classStartDT && dt < classEndDT) {
        return 'In Class';
      } else if (dt.getTime() == classEndDT.getTime()) {
        return 'End of Class';
      }
    }
  }

  // console.log(">>>>formatDueDate dt",dt)
  let returnValue = dt.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  returnValue = `${dt.getMonth() + 1}/${dt.getDate()} ${returnValue}`;
  if (returnValue === 'Invalid Date') {
    returnValue = null;
  }

  return returnValue;
}

function buildRows({
  dotw = '',
  rowLabel = '',
  assignments,
  clickCallback,
  completedArray,
  setCompletedArray,
  classTimes,
  weekShift,
  selectedItemId,
  showCompleted,
}) {
  let newRows = [];
  if (assignments.length > 0) {
    let isFirstRow = true;
    let numberOfVisibleRows = 0;
    for (let assignment of assignments) {
      // console.log("buildRows assignment",assignment)
      let checked = completedArray.includes(assignment.doenetId);

      if (showCompleted || (!showCompleted && !checked)) {
        numberOfVisibleRows++;
      }
    }
    //if more than one item loop through the rest
    for (let i = 0; i < assignments.length; i++) {
      let assignment = assignments[i];

      let assignedDate = UTCDateStringToDate(assignment.assignedDate);
      let displayAssignedDate = '';

      if (assignedDate) {
        assignedDate.setSeconds(0, 0);
      }

      let dueDate = UTCDateStringToDate(assignment.dueDate);
      let displayDueDate = '';
      let effectiveRowLabel = '';

      if (dueDate) {
        dueDate.setSeconds(0, 0);
        effectiveRowLabel = `${dotw} `;

        displayDueDate = formatDueDate(dueDate, classTimes);
        if (assignedDate) {
          displayAssignedDate = formatAssignedDate(
            assignedDate,
            classTimes,
            dueDate,
            weekShift == 0,
          );
        }
      }

      if (rowLabel !== '') {
        effectiveRowLabel = rowLabel;
      }

      let bgColor = null;
      if (assignment.itemId === selectedItemId) {
        bgColor = '#B8D2EA';
      }
      let oneClick = (e) => {
        e.stopPropagation();
        clickCallback({
          courseId: assignment.courseId,
          doenetId: assignment.doenetId
        });
      };
 
      let checked = completedArray.includes(assignment.doenetId);

      if (!showCompleted && checked) {
        continue;
      }

      let score = '';
      // console.log("assignment",assignment)

      if (assignment.gradeCategory){
        const totalPointsOrPercent = Number(assignment.totalPointsOrPercent)
        let pointsAwarded = Math.round(assignment.credit * totalPointsOrPercent * 100) / 100;
        if (assignment.creditOverride){
          pointsAwarded = Math.round(assignment.creditOverride * totalPointsOrPercent * 100) / 100;
        }
        score = `${pointsAwarded}/${totalPointsOrPercent}`;
      }

      let checkbox = (
        <Checkbox
          checked={checked}
          onClick={(e) => {
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

            axios.get('/api/saveCompleted.php', {
              params: { doenetId: assignment.doenetId },
            });
            // .then(({data})=>{
            // console.log(">>>>data",data)
            // })
          }}
          // style={{
          //   height: '18px',
          //   width: '177px',
          //   border: '2px solid black',
          //   borderRadius: '5px',
          // }}
        />
      );
      if (isFirstRow) {
        isFirstRow = false;

        newRows.push(
          <tr data-test={`cbw row ${i}`} key={`${effectiveRowLabel}${assignment.doenetId}`}>
            <td
              data-test={`cbw row label ${i}`}
              style={{ borderBottom: '2px solid black', padding: '8px' }}
              rowSpan={numberOfVisibleRows}
            >
              {effectiveRowLabel}
            </td>
            <td
              data-test={`cbw assignment label ${i}`}
              style={{
                backgroundColor: bgColor,
                padding: '8px',
                borderBottom: '2px solid black',
                cursor:"pointer"
              }}
              onClick={oneClick}
            >
              {assignment.label}
            </td>
            <td
              data-test={`cbw assigned date ${i}`}
              style={{
                backgroundColor: bgColor,
                padding: '8px',
                borderBottom: '2px solid black',
                cursor:"pointer"
              }}
              onClick={oneClick}
            >
              {displayAssignedDate}
            </td>
            <td
              data-test={`cbw due date ${i}`}
              style={{
                backgroundColor: bgColor,
                padding: '8px',
                borderBottom: '2px solid black',
                cursor:"pointer"
              }}
              onClick={oneClick}
            >
              {displayDueDate}
            </td>
            <td
              data-test={`cbw score ${i}`}
              style={{
                backgroundColor: bgColor,
                padding: '8px',
                borderBottom: '2px solid black',
                textAlign: 'center',
              }}
            >
              {score}
            </td>
            <td
              data-test={`cbw completed ${i}`}
              style={{
                backgroundColor: bgColor,
                padding: '8px',
                borderBottom: '2px solid black',
                textAlign: 'center',
              }}
            >
              {checkbox}
            </td>
          </tr>,
        );
      } else {
        newRows.push(
          <tr data-test={`cbw row ${i}`} key={`${effectiveRowLabel}${assignment.doenetId}${i}`}>
            <td
              data-test={`cbw assignment label ${i}`}
              style={{
                backgroundColor: bgColor,
                padding: '8px',
                borderBottom: '2px solid black',
                cursor:"pointer"
              }}
              onClick={oneClick}
            >
              {assignment.label}
            </td>
            <td
              data-test={`cbw assigned date ${i}`}
              style={{
                backgroundColor: bgColor,
                padding: '8px',
                borderBottom: '2px solid black',
                cursor:"pointer"
              }}
              onClick={oneClick}
            >
              {displayAssignedDate}
            </td>
            <td
              data-test={`cbw due date ${i}`}
              style={{
                backgroundColor: bgColor,
                padding: '8px',
                borderBottom: '2px solid black',
                cursor:"pointer"
              }}
              onClick={oneClick}
            >
              {displayDueDate}
            </td>
            <td
              data-test={`cbw score ${i}`}
              style={{
                backgroundColor: bgColor,
                padding: '8px',
                borderBottom: '2px solid black',
                textAlign: 'center',
              }}
            >
              {score}
            </td>
            <td
              data-test={`cbw completed ${i}`}
              style={{
                backgroundColor: bgColor,
                padding: '8px',
                borderBottom: '2px solid black',
                textAlign: 'center',
              }}
            >
              {checkbox}
            </td>
          </tr>,
        );
      }
    }
  }
  return newRows;
}

export default function Next7Days({ courseId }) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const showCompleted = useRecoilValue(showCompletedAtom);
  const showOverdue = useRecoilValue(showOverdueAtom);
  useInitCourseItems(courseId);
  // const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  // let [numColumns,setNumColumns] = useState(4);
  let [assignmentArray, setAssignmentArray] = useState([]);
  let [pinnedArray, setPinnedArray] = useState([]);
  let [completedArray, setCompletedArray] = useState([]);
  let [initialized, setInitialized] = useState(false);
  let [problemMessage, setProblemMessage] = useState('');
  let [weekShift, setWeekShift] = useState(0); //-1 means 7 days before
  let classTimes = useRecoilValue(classTimesAtom);
  let selected = useRecoilValue(globalSelectedNodesAtom);
  let selectedItemId = null;
  if (selected[0]?.driveInstanceId === 'currentContent') {
    selectedItemId = selected[0].itemId;
  }

  let loadAssignmentArray = useRecoilCallback(({ set }) => async (courseId) => {
    //Clear selection when click on main panel
    set(mainPanelClickAtom, (was) => [
      ...was,
      { atom: clearDriveAndItemSelections, value: null },
      { atom: selectedMenuPanelAtom, value: null },
    ]);

    const { data } = await axios.get('/api/loadTODO.php', {
      params: { courseId },
    });
    // console.log('Next7 data: ', data);
    // console.log('Next7 first assignment: ', data.assignments[0]);
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

  const clickCallback = useRecoilCallback(
    ({ set, snapshot }) =>
      async (info) => {
        const courseId = info.courseId;
        const doenetId = info.doenetId;
        let { canEditContent } = await snapshot.getPromise(
          effectivePermissionsByCourseId(courseId)
          );
          
          //Note: need to send pageId
        if (canEditContent === '1') {
            let itemObj = await snapshot.getPromise(
              itemByDoenetId(doenetId)
              );
              let pageId = findFirstPageOfActivity(itemObj.content)
              //TODO: VariantIndex params
              setPageToolView({
                page: 'course',
                tool: 'editor',
                view: '',
                params: {
                  doenetId,
                  pageId
                },
              });

          
        } else {
          //no edit permissions
            setPageToolView({
              page: 'course',
              tool: 'assignment',
              view: '',
              params: {
                doenetId,
              },
            });
     
        }
      },
    [],
  );

  if (!initialized && courseId !== '') {
    //Runs every time the page is returned to
    setInitialized(true); //prevent load on each refresh
    loadAssignmentArray(courseId);
    return null;
  }
  // return null;   // for testing

  if (problemMessage !== '') {
    return (
      <div>
        <h2>{problemMessage}</h2>
      </div>
    );
  }

  let today = new Date();
  let diff = 1 - today.getDay();
  if (diff === 1) {
    diff = -6;
  } //Start week on Monday
  let monday = new Date(
    today.getTime() +
      1000 * 60 * 60 * 24 * diff +
      1000 * 60 * 60 * 24 * weekShift * 7,
  );
  let sunday = new Date(monday.getTime() + 1000 * 60 * 60 * 24 * 6);
  let headerMonday = `${monday.getMonth() + 1}/${monday.getDate()}`;
  let headerSunday = `${sunday.getMonth() + 1}/${sunday.getDate()}`;

  let pinnedRows = [];
  let overdueRows = [];
  let pinnedName = (
    <p>
      <FontAwesomeIcon icon={faThumbtack} /> Pinned
    </p>
  );
  //This content only shows when viewing the current week
  if (weekShift == 0) {
    pinnedRows.push(
      ...buildRows({
        rowLabel: pinnedName,
        assignments: pinnedArray,
        clickCallback,
        completedArray,
        setCompletedArray,
        classTimes,
        weekShift,
        selectedItemId,
        showCompleted,
      }),
    );

    if (showOverdue) {
      //Find overdue assignments
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

      overdueRows.push(
        ...buildRows({
          rowLabel: 'Overdue',
          assignments: overdueArray,
          clickCallback,
          completedArray,
          setCompletedArray,
          classTimes,
          weekShift,
          selectedItemId,
          showCompleted,
        }),
      );
    }
  }

  let dayRows = [];

  let beginningOfMondayDT = new Date(monday.getTime());
  beginningOfMondayDT.setHours(0, 0, 0, 0);
  let endOfSundayDT = new Date(sunday.getTime());
  endOfSundayDT.setHours(23, 59, 59, 999);

  //Add full assignment information to the day of the week by index
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
    dueByDOTW[assignmentDOTW].push({ ...assignment });
  }
  //Move sunday assignments to the end of the array
  dueByDOTW.push(dueByDOTW.shift());

  const dotwLabel = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  for (let [index, dayAssignments] of Object.entries(dueByDOTW)) {
    dayRows.push(
      ...buildRows({
        dotw: dotwLabel[index],
        assignments: dayAssignments,
        clickCallback,
        completedArray,
        setCompletedArray,
        classTimes,
        weekShift,
        selectedItemId,
        showCompleted,
      }),
    );
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          // backgroundColor:"grey",
          alignItems: 'center',
          justifyContent: 'space-evenly',
          width: '850px',
          height: '70px',
        }}
      >
        <span>
          <Button onClick={() => setWeekShift(0)} value="This Week" />{' '}
        </span>
        <h1>Content by Week</h1>
        <span style={{ fontSize: '1.4em' }}>
          {headerMonday} - {headerSunday}
        </span>
        <ButtonGroup>
          <span>
            <Button
              dataTest='previous week button'
              onClick={() => setWeekShift((was) => was - 1)}
              icon={<FontAwesomeIcon icon={faChevronLeft} />}
            />
          </span>
          <span>
            <Button
              dataTest='next week button'
              onClick={() => setWeekShift((was) => was + 1)}
              icon={<FontAwesomeIcon icon={faChevronRight} />}
            />
          </span>
        </ButtonGroup>
      </div>

      <table style={{ width: '850px', borderSpacing: '0em .2em' }}>
        <tr>
          <th
            style={{
              width: '100px',
              padding: '8px',
              textAlign: 'left',
              borderBottom: '2px solid black',
            }}
          >
            Day
          </th>
          <th
            style={{
              width: '200px',
              padding: '8px',
              textAlign: 'left',
              borderBottom: '2px solid black',
            }}
          >
            Name
          </th>
          <th
            style={{
              width: '200px',
              padding: '8px',
              textAlign: 'left',
              borderBottom: '2px solid black',
            }}
          >
            Assigned
          </th>
          <th
            style={{
              width: '200px',
              padding: '8px',
              textAlign: 'left',
              borderBottom: '2px solid black',
            }}
          >
            Due
          </th>
          <th
            style={{
              width: '50px',
              padding: '8px',
              textAlign: 'left',
              borderBottom: '2px solid black',
            }}
          >
            Score
          </th>
          <th
            style={{
              width: '100px',
              padding: '8px',
              textAlign: 'center',
              borderBottom: '2px solid black',
            }}
          >
            Completed
          </th>
        </tr>
        {pinnedRows}
        {overdueRows}
        {dayRows}
      </table>
    </>
  );
}
