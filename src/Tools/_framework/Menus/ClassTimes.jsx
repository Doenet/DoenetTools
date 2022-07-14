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
import { recoilAddToast } from '../Toast';
import { DateToUTCDateString } from '../../../_utils/dateUtilityFunction';

const TimeEntry = ({ parentValue, valueCallback = () => {} }) => {
  let [time, setTime] = useState(parentValue);
  let [previousTime, setPreviousTime] = useState(parentValue); //Prevent valueCallback calls if value didn't change

  //This causes extra calls, but updates time when prop changes
  if (parentValue != previousTime) {
    setTime(parentValue);
    setPreviousTime(parentValue);
  }

  return (
    <input
      type="text"
      value={time}
      style={{ width: '40px' }}
      onChange={(e) => {
        setTime(e.target.value);
      }}
      onBlur={() => {
        if (previousTime !== time) {
          valueCallback(time);
          setPreviousTime(time);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          if (previousTime !== time) {
            valueCallback(time);
            setPreviousTime(time);
          }
        }
      }}
    />
  );
};

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
  const addClassTime = useRecoilCallback(({ set, snapshot }) => async () => {
    let was = await snapshot.getPromise(classTimesAtom); //  get all classTimes
    let newArr = [...was]; // enter in arr
    const newClassTime = {
      // make new classTime
      dotwIndex: 1, // ? monday 9 to 10 am
      startTime: '09:00',
      endTime: '10:00',
    };
    newArr.push(newClassTime); // add to arr
    newArr = sortClassTimes(newArr); // sort (chronological)
    set(classTimesAtom, newArr); // set atom

    let courseId = await snapshot.getPromise(searchParamAtomFamily('courseId')); // get courseId
    console.log(courseId);
    let dotwIndexes = []; // create arrays
    let startTimes = [];
    let endTimes = [];
    for (let classTime of newArr) {
      // fill arrays
      dotwIndexes.push(classTime.dotwIndex);
      startTimes.push(classTime.startTime);
      endTimes.push(classTime.endTime);
    }

    let resp = await axios.post('/api/updateClassTimes.php', {
      // php updates classTimes table
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
      async ({ index, newClassTime }) => {
        let was = await snapshot.getPromise(classTimesAtom);
        let newArr = [...was];
        newArr[index] = { ...newClassTime }; // specific
        newArr = sortClassTimes(newArr);
        console.log('update');
        set(classTimesAtom, newArr);

        let courseId = await snapshot.getPromise(
          searchParamAtomFamily('courseId'),
        );
        let dotwIndexes = [];
        let startTimes = [];
        let endTimes = [];
        for (let classTime of newArr) {
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
      async ({ index }) => {
        let was = await snapshot.getPromise(classTimesAtom);
        let newArr = [...was];
        newArr.splice(index, 1); // remove classTime at index
        newArr = sortClassTimes(newArr);
        set(classTimesAtom, newArr);

        let courseId = await snapshot.getPromise(
          searchParamAtomFamily('courseId'),
        );
        let dotwIndexes = [];
        let startTimes = [];
        let endTimes = [];
        for (let classTime of newArr) {
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

    timesJSX.push(
      <>
        <tr>
          <td style={{ width: '190px' }}>
            {/* DAY PICKER DROPDOWN */}
            <DropdownMenu
              width="180px"
              items={dotwItems}
              valueIndex={timeObj.dotwIndex}
              onChange={({ value }) => {
                let newClassTime = { ...timeObj };
                newClassTime.dotwIndex = value;
                updateClassTime({ index, newClassTime });
              }}
            />
          </td>
          {/* DELETE TIME BUTTON */}
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
            {/* START TIME PICKER */}
            <DateTime
              datePicker={false}
              width="74px"
              parentValue={timeObj.startTime}
              onBlur={(value, valid) => {
                // if (valid) {
                let newClassTime = { ...timeObj };
                newClassTime.startTime = DateToUTCDateString(
                  new Date(value.value._d),
                );
                // console.log('getTime: ', newClassTime.startTime.getHour());
                console.log(
                  'typeof newClassTime.startTime',
                  typeof newClassTime.startTime,
                );
                console.log('newClassTime.startTime ', newClassTime.startTime);
                console.log('newStartTime: ', index, newClassTime);
                updateClassTime({ index, newClassTime });
                // } else {
                // console.log('not valid'); // TODO toast
                // }
              }}
            />
          </td>
          <td style={{ marginLeft: '6px', marginRight: '6px' }}>-</td>
          {/* In the menu panel, the right-side time picker's dropdown is shifted with --menuPanelMargin so that it's not cut off */}
          <td style={{ ['--menuPanelMargin']: '-62px' }}>
            {/* END TIME PICKER */}
            <DateTime
              datePicker={false}
              width="74px"
              parentValue={timeObj.endTime}
              onBlur={(value, valid) => {
                let newClassTime = { ...timeObj };
                newClassTime.endTime = DateToUTCDateString(
                  new Date(value.value._d),
                );
                updateClassTime({ index, newClassTime });
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
        onClick={() => addClassTime()}
      />
    </>
  );
}
