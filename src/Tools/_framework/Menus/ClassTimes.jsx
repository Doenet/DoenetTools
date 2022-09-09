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
// import { recoilAddToast } from '../Toast';
import { DateToUTCDateString } from '../../../_utils/dateUtilityFunction';

// const TimeEntry = ({ parentValue, valueCallback = () => {} }) => {
//   let [time, setTime] = useState(parentValue);
//   let [previousTime, setPreviousTime] = useState(parentValue); //Prevent valueCallback calls if value didn't change

//   //This causes extra calls, but updates time when prop changes
//   if (parentValue != previousTime) {
//     setTime(parentValue);
//     setPreviousTime(parentValue);
//   }

//   return (
//     <input
//       type="text"
//       value={time}
//       style={{ width: '40px' }}
//       onChange={(e) => {
//         setTime(e.target.value);
//       }}
//       onBlur={() => {
//         if (previousTime !== time) {
//           valueCallback(time);
//           setPreviousTime(time);
//         }
//       }}
//       onKeyDown={(e) => {
//         if (e.key === 'Enter') {
//           if (previousTime !== time) {
//             valueCallback(time);
//             setPreviousTime(time);
//           }
//         }
//       }}
//     />
//   );
// };

function sortClassTimes(classTimesArray) {
  return classTimesArray.sort((first, second) => {
    //Sunday at the end
    let mondayFirstDotw = first.dotwIndex;
    if (mondayFirstDotw === 0) {
      mondayFirstDotw = 7;
    }
    let mondaySecondDotw = second.dotwIndex;
    if (mondaySecondDotw === 0) {
      mondaySecondDotw = 7;
    }
    if (mondayFirstDotw > mondaySecondDotw) {
      return 1;
    } else if (mondayFirstDotw < mondaySecondDotw) {
      return -1;
    } else {
      //They are equal so go by start time
      let firstStartDate = new Date();
      const [firstHour, firstMinute] = first.startTime.split(':');
      firstStartDate.setHours(firstHour, firstMinute, 0, 0);
      let secondStartDate = new Date();
      const [secondHour, secondMinute] = second.startTime.split(':');
      secondStartDate.setHours(secondHour, secondMinute, 0, 0);
      if (firstStartDate > secondStartDate) {
        return 1;
      } else {
        return -1;
      }
    }
  });
}

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
    nextArr = sortClassTimes(nextArr); 
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
    console.log('resp: ', resp);
    console.log('>>>>data', data);
  });

  const updateClassTime = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ index, nextClassTime, courseId }) => {
        let was = await snapshot.getPromise(classTimesAtom);
        let nextArr = [...was];
        nextArr[index] = { ...nextClassTime }; // specific
        nextArr = sortClassTimes(nextArr);
        console.log('update');
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
        console.log('>>>>data', data);
      },
  );

  const deleteClassTime = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ index, courseId }) => {
        let was = await snapshot.getPromise(classTimesAtom);
        let nextArr = [...was];
        nextArr.splice(index, 1); // remove classTime at index
        nextArr = sortClassTimes(nextArr);
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
        console.log('>>>>data', data);
      },
  );

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
    console.log('timeObj ', timeObj);
    console.log('timeObj.startTime', timeObj.startTime);

    timesJSX.push(
      <>
        <tr>
          <td style={{ width: '190px' }}>
            <DropdownMenu
              width="180px"
              items={dotwItems}
              valueIndex={timeObj.dotwIndex}
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
              value={new Date(timeObj.startTime)}
              onBlur={(value, valid) => {
                // if (valid) {
                let nextClassTime = { ...timeObj };
                nextClassTime.startTime = DateToUTCDateString(
                  new Date(value.value._d),
                );
                updateClassTime({courseId, index, nextClassTime });
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
              value={new Date(timeObj.endTime)}
              onBlur={(value, valid) => {
                // if (valid) {
                let nextClassTime = { ...timeObj };
                nextClassTime.endTime = DateToUTCDateString(
                  new Date(value.value._d),
                );
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
