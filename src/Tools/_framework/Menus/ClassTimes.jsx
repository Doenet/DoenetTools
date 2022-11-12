import React, { useState } from 'react';
import {
  // useRecoilState,
  useRecoilCallback,
  useRecoilValue,
} from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { classTimesAtom } from '../Widgets/Next7Days';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import DateTime from '../../../_reactComponents/PanelHeaderComponents/DateTime';
import axios from 'axios';
import { searchParamAtomFamily } from '../NewToolRoot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';


export default function ClassTimes() {
  const timesObj = useRecoilValue(classTimesAtom);
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));

  const addClassTime = useRecoilCallback(({ set, snapshot }) => async (courseId) => {
    let prevTimesArr = await snapshot.getPromise(classTimesAtom); 
    let nextArr = [...prevTimesArr]; 
    // Default new classTime
    nextArr.push({
      dotwIndex: 1, // monday 9 to 10 am
      startTime: '09:00',
      endTime: '10:00',
    }); 
    set(classTimesAtom, nextArr); 

    let dotwIndexes = []; // create arrays
    let startTimes = [];
    let endTimes = [];
    for (let classTime of nextArr) {
      // fill arrays
      dotwIndexes.push(classTime.dotwIndex);
      startTimes.push(classTime.startTime);
      endTimes.push(classTime.endTime);
    }

    // php updates classTimes table
    let resp = await axios.post('/api/updateClassTimes.php', {
      courseId,
      dotwIndexes,
      startTimes,
      endTimes,
    });
    let { data } = resp;
  });

  const updateClassTime = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ index, nextClassTime, courseId }) => {
        let was = await snapshot.getPromise(classTimesAtom);
        let nextArr = [...was];
        nextArr[index] = { ...nextClassTime }; 

        set(classTimesAtom, nextArr);

        let dotwIndexes = [];
        let startTimes = [];
        let endTimes = [];
        for (let classTime of nextArr) {
          dotwIndexes.push(classTime.dotwIndex);
          startTimes.push(classTime.startTime);
          endTimes.push(classTime.endTime);
        }

        let resp = await axios.post('/api/updateClassTimes.php', {
          courseId,
          dotwIndexes,
          startTimes,
          endTimes,
        });

      },
  );

  const deleteClassTime = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ index, courseId }) => {
        let was = await snapshot.getPromise(classTimesAtom);
        let nextArr = [...was];
        nextArr.splice(index, 1); // remove classTime at index
        set(classTimesAtom, nextArr);

        let dotwIndexes = [];
        let startTimes = [];
        let endTimes = [];
        for (let classTime of nextArr) {
          dotwIndexes.push(classTime.dotwIndex);
          startTimes.push(classTime.startTime);
          endTimes.push(classTime.endTime);
        }

        let resp = await axios.post('/api/updateClassTimes.php', {
          courseId,
          dotwIndexes,
          startTimes,
          endTimes,
        });
        let { data } = resp;
      },
  );




  //TODO!!!!: FIX DAYS OF THE WEEK!!! WASN'T SHOWING SUNDAY


  const dotwItems = [
    [1, 'Monday'],
    [2, 'Tuesday'],
    [3, 'Wednesday'],
    [4, 'Thursday'],
    [5, 'Friday'],
    [6, 'Saturday'],
    [0, 'Sunday'],
  ];

  let timesJSX = [];
  for (let [index, timeObj] of Object.entries(timesObj)) {
    const startTimeWholeDate = new Date();
    startTimeWholeDate.setHours(timeObj.startTime.split(":")[0]);
    startTimeWholeDate.setMinutes(timeObj.startTime.split(":")[1]);
    const endTimeWholeDate = new Date();
    endTimeWholeDate.setHours(timeObj.endTime.split(":")[0]);
    endTimeWholeDate.setMinutes(timeObj.endTime.split(":")[1]);
    let dropDownDOTWIndex = timeObj.dotwIndex;
    if (timeObj.dotwIndex == 0){dropDownDOTWIndex = 7 }
    timesJSX.push(
      <>
        <tr>
          <td style={{ width: '190px' }}>
            <DropdownMenu
              width="180px"
              items={dotwItems}
              valueIndex={dropDownDOTWIndex}
              onChange={({ value }) => {
                let nextClassTime = { ...timeObj };
                nextClassTime.dotwIndex = value;
                updateClassTime({courseId, index, nextClassTime });
              }}
            />
          </td>
          <Button
            icon={<FontAwesomeIcon icon={faTimes} />}
            alert
            onClick={() => {
              deleteClassTime({ index });
            }}
          />
        </tr>
        <tr style={{ width: '190px', display: 'flex', alignItems: 'center' }}>
          <td>
            <DateTime
              datePicker={false}
              width="74px"
              value={startTimeWholeDate}
              onBlur={(value, valid) => {
                // if (valid) {
                  let nextClassTime = { ...timeObj };
                  nextClassTime.startTime = new Date(value.value._d)
                  .toLocaleString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' })

                updateClassTime({courseId, index, nextClassTime });
                // updateClassTime({courseId, index, nextClassTime:new Date(value.value._d) });
                // } else {
                // console.log('not valid'); // TODO toast
                // }
              }}
            />
          </td>
          <td style={{ marginLeft: '6px', marginRight: '6px' }}>-</td>
          <td style={{ ['--menuPanelMargin']: '-62px' }}>
            <DateTime
              datePicker={false}
              width="74px"
              value={endTimeWholeDate}
              onBlur={(value, valid) => {
                // if (valid) {
                let nextClassTime = { ...timeObj };
                nextClassTime.endTime = new Date(value.value._d)
                .toLocaleString('en-US', { 
                  hour12: false, 
                  hour: '2-digit', 
                  minute: '2-digit' })
                updateClassTime({courseId, index, nextClassTime });
                // } else {
                // console.log('not valid'); // TODO toast
                // }
              }}
            />
          </td>
        </tr>
        <div style={{ margin: '10px' }}></div>
      </>,
    );
  }

  let classTimesTable = <div>No times set.</div>;

  if (timesJSX.length > 0) {
    classTimesTable = (
      <table style={{ width: '230px', margins: '5px' }}>{timesJSX}</table>
    );
  }
  return (
    <>
      {classTimesTable}
      <Button
        icon={<FontAwesomeIcon icon={faPlus} />}
        style={{ margin: 'auto' }}
        onClick={() => addClassTime(courseId)}
      />
    </>
  );
}
