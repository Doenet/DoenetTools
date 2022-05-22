import {
  faCalendarPlus,
  faCalendarTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DateToDateString } from '../../_utils/dateUtilityFunction';
import DateTime from '../PanelHeaderComponents/DateTime';
import { useActivity } from './ActivityActions';
import Checkbox from '../../_reactComponents/PanelHeaderComponents/Checkbox';
import Increment from '../PanelHeaderComponents/IncrementMenu';
import DropdownMenu from '../PanelHeaderComponents/DropdownMenu';
import { useRecoilValue } from 'recoil';
import { enrollmentByCourseId, itemByDoenetId, useCourse } from '../Course/CourseActions';
import axios from 'axios';
import RelatedItems from '../PanelHeaderComponents/RelatedItems';
import ActionButtonGroup from '../PanelHeaderComponents/ActionButtonGroup';
import ActionButton from '../PanelHeaderComponents/ActionButton';
import { toastType, useToast } from '@Toast';



const InputWrapper = styled.div`
  margin: 0 5px 10px 5px;
  display: ${(props) => (props.flex ? 'flex' : 'block')};
  align-items: ${(props) => props.flex && 'center'};
`;

const LabelText = styled.span`
  margin-bottom: 5px;
`;

const CheckboxLabelText = styled.span`
  font-size: 15px;
  line-height: 1.1;
`;

const InputControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AssignUnassignActivity = ({ doenetId, courseId }) => {

  const {
    compileActivity,
    updateAssignItem
  } = useCourse(courseId);
  const {
    isAssigned,
  } = useRecoilValue(itemByDoenetId(doenetId));
  const addToast = useToast();


  let assignActivityText = 'Assign Activity';
  if (isAssigned) {
    // if (assignedCid != null) {
    assignActivityText = 'Update Assigned Activity';
  }

  return (<ActionButtonGroup vertical>
  <ActionButton
  width="menu"
  value={assignActivityText}
  onClick={() => {
    compileActivity({
      activityDoenetId: doenetId,
      isAssigned: true,
      courseId,
      // successCallback: () => {
      //   addToast('Activity Assigned.', toastType.INFO);
      // },
    });
    updateAssignItem({
      doenetId,
      isAssigned:true,
      successCallback: () => {
        addToast("Activity Assigned", toastType.INFO);
      },
    })
  }}
/>
{isAssigned ? 
<ActionButton
  width="menu"
  value="Unassign Activity"
  alert
  onClick={() => {
    updateAssignItem({
      doenetId,
      isAssigned:false,
      successCallback: () => {
        addToast("Activity Unassigned", toastType.INFO);
      },
    })
  
  }}
/>
: null}
</ActionButtonGroup>)
}

export const AssignedDate = ({ doenetId, courseId }) => {
  const addToast = useToast();

  const {
    value: { assignedDate: recoilValue },
    updateAssignmentSettings,
  } = useActivity(courseId, doenetId);
  const [assignedDate, setAssignedDate] = useState(recoilValue);

  //TODO convert
  useEffect(() => {
    setAssignedDate(recoilValue);
  }, [recoilValue]);

  return (
    <InputWrapper>
      <LabelText>Assigned Date</LabelText>
      <InputControl onClick={(e) => e.preventDefault()}>
        <Checkbox
          style={{ marginRight: '5px' }}
          checkedIcon={<FontAwesomeIcon icon={faCalendarPlus} />}
          uncheckedIcon={<FontAwesomeIcon icon={faCalendarTimes} />}
          checked={assignedDate !== null && assignedDate !== undefined}
          onClick={() => {
            let valueDescription = 'None';
            let value = null;

            if (assignedDate === null || assignedDate === undefined) {
              valueDescription = 'Now';
              value = DateToDateString(new Date());
            }

            setAssignedDate(value);
            updateAssignmentSettings({
              keyToUpdate: 'assignedDate',
              value,
              description: 'Assigned Date',
              valueDescription,
            });
          }}
        />
        <DateTime
          disabled={assignedDate === null || assignedDate === undefined}
          value={assignedDate ? new Date(assignedDate) : null}
          disabledText="No Assigned Date"
          disabledOnClick={() => {
            let valueDescription = 'Now';
            let value = DateToDateString(new Date());
            // setAssignedDate(value);

            updateAssignmentSettings({
              keyToUpdate: 'assignedDate',
              value,
              description: 'Assigned Date',
              valueDescription,
            });
          }}
          onBlur={({ valid, value }) => {
            if (valid) {
              try {
                value = value.toDate();
              } catch (e) {
                // console.log('value not moment');
              }
              if (
                new Date(DateToDateString(value)).getTime() !==
                new Date(assignedDate).getTime()
              ) {
                setAssignedDate(DateToDateString(value));

                updateAssignmentSettings(doenetId, {
                  keyToUpdate: 'assignedDate',
                  value: DateToDateString(value),
                  description: 'Assigned Date',
                });
              }
            } else {
              addToast('Invalid Assigned Date');
            }
          }}
        />
      </InputControl>
    </InputWrapper>
  );
};

export const DueDate = ({ courseId, doenetId }) => {
  const addToast = useToast();

  const {
    value: { dueDate: recoilValue },
    updateAssignmentSettings,
  } = useActivity(courseId, doenetId);
  const [dueDate, setDueDate] = useState();

  //TODO convert
  useEffect(() => {
    setDueDate(recoilValue);
  }, [recoilValue]);

  return (
    <InputWrapper>
      <LabelText>Due Date</LabelText>
      <InputControl onClick={(e) => e.preventDefault()}>
        <Checkbox
          style={{ marginRight: '5px' }}
          checkedIcon={<FontAwesomeIcon icon={faCalendarPlus} />}
          uncheckedIcon={<FontAwesomeIcon icon={faCalendarTimes} />}
          checked={dueDate !== null && dueDate !== undefined}
          onClick={() => {
            let valueDescription = 'None';
            let value = null;

            if (dueDate === null || dueDate === undefined) {
              valueDescription = 'Next Week';
              let nextWeek = new Date();
              nextWeek.setDate(nextWeek.getDate() + 7);
              value = DateToDateString(nextWeek);
            }
            setDueDate(value);

            updateAssignmentSettings({
              keyToUpdate: 'dueDate',
              value,
              description: 'Due Date',
              valueDescription,
            });
          }}
        />

        <DateTime
          disabled={dueDate === null || dueDate === undefined}
          value={dueDate ? new Date(dueDate) : null}
          onBlur={({ valid, value }) => {
            if (valid) {
              try {
                value = value.toDate();
              } catch (e) {
                // console.log('value not moment');
              }
              if (
                new Date(DateToDateString(value)).getTime() !==
                new Date(dueDate).getTime()
              ) {
                setDueDate(DateToDateString(value));
                updateAssignmentSettings({
                  keyToUpdate: 'dueDate',
                  value: DateToDateString(value),
                  description: 'Due Date',
                });
              }
            } else {
              addToast('Invalid Due Date');
            }
          }}
          disabledText="No Due Date"
          disabledOnClick={() => {
            let valueDescription = 'Next Week';
            let nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            let value = DateToDateString(nextWeek);
            setDueDate(value);
            updateAssignmentSettings({
              keyToUpdate: 'dueDate',
              value,
              description: 'Due Date',
              valueDescription,
            });
          }}
        />
      </InputControl>
    </InputWrapper>
  );
};

export const TimeLimit = ({ courseId, doenetId }) => {
  const {
    value: { timeLimit: recoilValue },
    updateAssignmentSettings,
  } = useActivity(courseId, doenetId);
  const [timeLimit, setTimeLimit] = useState();

  useEffect(() => {
    setTimeLimit(recoilValue);
  }, [recoilValue]);
  return (
    <InputWrapper>
      <LabelText>Time Limit in Minutes</LabelText>
      <InputControl onClick={(e) => e.preventDefault()}>
        <Checkbox
          style={{ marginRight: '5px' }}
          checked={timeLimit !== null}
          onClick={() => {
            let valueDescription = 'Not Limited';
            let value = null;
            if (timeLimit === null) {
              valueDescription = '60 Minutes';
              value = 60;
            }
            setTimeLimit(value);
            updateAssignmentSettings({
              keyToUpdate: 'timeLimit',
              value,
              description: 'Time Limit ',
              valueDescription,
            });
          }}
        />
        <Increment
          disabled={timeLimit === null}
          value={timeLimit}
          min={0}
          onBlur={() => {
            if (recoilValue !== timeLimit) {
              let timelimitlocal = null;
              if (timeLimit < 0 || timeLimit === '' || isNaN(timeLimit)) {
                setTimeLimit(0);
                timelimitlocal = 0;
              } else {
                timelimitlocal = parseInt(timeLimit);
                setTimeLimit(parseInt(timeLimit));
              }
              let valueDescription = `${timelimitlocal} Minutes`;

              updateAssignmentSettings({
                keyToUpdate: 'timeLimit',
                value: timelimitlocal,
                description: 'Time Limit',
                valueDescription,
              });
            }
          }}
          onChange={(newValue) => setTimeLimit(newValue)}
        />
      </InputControl>
    </InputWrapper>
  );
};

export const AttempLimit = ({ courseId, doenetId }) => {
  const {
    value: { numberOfAttemptsAllowed: recoilValue },
    updateAssignmentSettings,
  } = useActivity(courseId, doenetId);

  const [numberOfAttemptsAllowed, setNumberOfAttemptsAllowed] =
    useState(recoilValue);

  useEffect(() => {
    setNumberOfAttemptsAllowed(recoilValue);
  }, [recoilValue]);

  return (
    <InputWrapper>
      <LabelText>Attempts</LabelText>
      <InputControl onClick={(e) => e.preventDefault()}>
        <Checkbox
          style={{ marginRight: '5px' }}
          checked={numberOfAttemptsAllowed !== null}
          onClick={() => {
            let valueDescription = 'Not Limited';
            let value = null;
            if (numberOfAttemptsAllowed === null) {
              valueDescription = '1';
              value = 1;
            }
            setNumberOfAttemptsAllowed(value);
            updateAssignmentSettings({
              keyToUpdate: 'numberOfAttemptsAllowed',
              value,
              description: 'Attempts Allowe',
              valueDescription,
            });
          }}
        />
        <Increment
          disabled={numberOfAttemptsAllowed === null}
          value={numberOfAttemptsAllowed}
          min={0}
          onBlur={() => {
            if (recoilValue !== numberOfAttemptsAllowed) {
              let numberOfAttemptsAllowedLocal = 1;
              if (
                numberOfAttemptsAllowed <= 0 ||
                numberOfAttemptsAllowed === '' ||
                isNaN(numberOfAttemptsAllowed)
              ) {
                setNumberOfAttemptsAllowed(numberOfAttemptsAllowedLocal);
              } else {
                numberOfAttemptsAllowedLocal = parseInt(
                  numberOfAttemptsAllowed,
                );
                setNumberOfAttemptsAllowed(numberOfAttemptsAllowedLocal);
              }

              updateAssignmentSettings({
                keyToUpdate: 'numberOfAttemptsAllowed',
                value: numberOfAttemptsAllowedLocal,
                description: 'Attempts Allowed',
              });
            }
          }}
          onChange={(newValue) => setNumberOfAttemptsAllowed(newValue)}
        />
      </InputControl>
    </InputWrapper>
  );
};

export const AttemptAggregation = ({ courseId, doenetId }) => {
  const {
    value: { attemptAggregation: recoilValue },
    updateAssignmentSettings,
  } = useActivity(courseId, doenetId);
  const [attemptAggregation, setAttemptAggregation] = useState();

  useEffect(() => {
    setAttemptAggregation(recoilValue);
  }, [recoilValue]);
  return (
    <InputWrapper>
      <LabelText>Attempt Aggregation</LabelText>
      <InputControl>
        <DropdownMenu
          width="menu"
          valueIndex={attemptAggregation === 'm' ? 1 : 2}
          items={[
            ['m', 'Maximum'],
            ['l', 'Last Attempt'],
          ]}
          onChange={({ value: val }) => {
            let valueDescription = 'Maximum';
            if (val === 'l') {
              valueDescription = 'Last Attempt';
            }
            setAttemptAggregation(val);
            updateAssignmentSettings({
              keyToUpdate: 'attemptAggregation',
              value: val,
              description: 'Attempt Aggregation',
              valueDescription,
            });
          }}
        />
      </InputControl>
    </InputWrapper>
  );
};

export const TotalPointsOrPercent = ({ courseId, doenetId }) => {
  const {
    value: { totalPointsOrPercent: recoilValue },
    updateAssignmentSettings,
  } = useActivity(courseId, doenetId);
  const [totalPointsOrPercent, setTotalPointsOrPercent] = useState();

  useEffect(() => {
    setTotalPointsOrPercent(recoilValue);
  }, [recoilValue]);

  return (
    <InputWrapper>
      <LabelText>Total Points Or Percent</LabelText>
      <InputControl>
        <Increment
          value={totalPointsOrPercent}
          min={0}
          onBlur={() => {
            if (recoilValue !== totalPointsOrPercent) {
              let totalPointsOrPercentLocal = null;
              if (
                totalPointsOrPercent < 0 ||
                totalPointsOrPercent === '' ||
                isNaN(totalPointsOrPercent)
              ) {
                setTotalPointsOrPercent(0);
                totalPointsOrPercentLocal = 0;
              } else {
                totalPointsOrPercentLocal = parseInt(totalPointsOrPercent);
                setTotalPointsOrPercent(parseInt(totalPointsOrPercent));
              }

              updateAssignmentSettings(doenetId, {
                keyToUpdate: 'totalPointsOrPercent',
                value: totalPointsOrPercentLocal,
                description: 'Total Points Or Percent',
              });
            }
          }}
          onChange={(newValue) => setTotalPointsOrPercent(newValue)}
        />
      </InputControl>
    </InputWrapper>
  );
};

export const GradeCategory = ({ courseId, doenetId }) => {
  const {
    value: { gradeCategory: recoilValue },
    updateAssignmentSettings,
  } = useActivity(courseId, doenetId);
  const [gradeCategory, setGradeCategory] = useState();

  useEffect(() => {
    setGradeCategory(recoilValue);
  }, [recoilValue]);

  return (
    <InputWrapper>
      <LabelText>Grade Category</LabelText>
      <DropdownMenu
        valueIndex={
          {
            gateway: 1,
            exams: 2,
            quizzes: 3,
            'problem sets': 4,
            projects: 5,
            participation: 6,
          }[gradeCategory]
        }
        items={[
          ['gateway', 'Gateway'],
          ['exams', 'Exams'],
          ['quizzes', 'Quizzes'],
          ['problem sets', 'Problem Sets'],
          ['projects', 'Projects'],
          ['participation', 'Participation'],
        ]}
        onChange={({ value: val }) => {
          if (recoilValue !== val) {
            // aInfoRef.current.gradeCategory = val;
            setGradeCategory(val);
            updateAssignmentSettings({
              keyToUpdate: 'gradeCategory',
              value: val,
              description: 'Grade Category',
            });
          }
        }}
      />
    </InputWrapper>
  );
};

export const CheckedSetting = ({
  courseId,
  doenetId,
  keyToUpdate,
  description,
  label,
  invert,
}) => {
  const {
    value: { [keyToUpdate]: recoilValue },
    updateAssignmentSettings,
  } = useActivity(courseId, doenetId);
  const [localValue, setLocalValue] = useState(recoilValue);

  useEffect(() => {
    setLocalValue(recoilValue);
  }, [invert, recoilValue]);
  return (
    <InputWrapper flex>
      <Checkbox
        style={{ marginRight: '5px' }}
        checked={invert ? !localValue : localValue}
        onClick={() => {
          let valueDescription = invert ? 'True' : 'Flase';
          let value = false;
          if (!localValue) {
            valueDescription = invert ? 'False' : 'True';
            value = true;
          }
          setLocalValue(value);
          updateAssignmentSettings({
            keyToUpdate,
            value,
            description,
            valueDescription,
          });
        }}
      />
      <CheckboxLabelText>{label ?? description}</CheckboxLabelText>
    </InputWrapper>
  );
};

export const CheckedFlag = ({
  courseId,
  doenetId,
  keyToUpdate,
  description,
  label,
  invert,
}) => {
  const {
    value: { [keyToUpdate]: recoilValue },
    updateActivityFlags,
  } = useActivity(courseId, doenetId);
  const [localValue, setLocalValue] = useState(recoilValue);

  useEffect(() => {
    setLocalValue(recoilValue);
  }, [recoilValue, invert]);
  return (
    <InputWrapper flex>
      <Checkbox
        style={{ marginRight: '5px' }}
        checked={invert ? !localValue : localValue}
        onClick={() => {
          let valueDescription = invert ? 'True' : 'Flase';
          let value = false;
          if (!localValue) {
            valueDescription = invert ? 'False' : 'True';
            value = true;
          }
          setLocalValue(value);
          updateActivityFlags({
            keyToUpdate,
            value,
            description,
            valueDescription,
          });
        }}
      />
      <CheckboxLabelText>{label ?? description}</CheckboxLabelText>
    </InputWrapper>
  );
};

export const Individualize = ({ courseId, doenetId }) => {
  return (
    <CheckedSetting
      courseId={courseId}
      doenetId={doenetId}
      keyToUpdate="individualize"
      description="Individualize"
    />
  );
};

export const ShowSolution = ({ courseId, doenetId }) => {
  return (
    <CheckedSetting
      courseId={courseId}
      doenetId={doenetId}
      keyToUpdate="showSolution"
      description="Show Solution"
    />
  );
};

export const ShowSolutionInGradebook = ({ courseId, doenetId }) => {
  return (
    <CheckedSetting
      courseId={courseId}
      doenetId={doenetId}
      keyToUpdate="showSolutionInGradebook"
      description="Show Solution In Gradebook"
    />
  );
};

export const ShowFeedback = ({ courseId, doenetId }) => {
  return (
    <CheckedSetting
      courseId={courseId}
      doenetId={doenetId}
      keyToUpdate="showFeedback"
      description="Show Feedback"
    />
  );
};

export const ShowHints = ({ courseId, doenetId }) => {
  return (
    <CheckedSetting
      courseId={courseId}
      doenetId={doenetId}
      keyToUpdate="showHints"
      description="Show Hints"
    />
  );
};

export const ShowCorrectness = ({ courseId, doenetId }) => {
  return (
    <CheckedSetting
      courseId={courseId}
      doenetId={doenetId}
      keyToUpdate="showCorrectness"
      description="Show Correctness"
    />
  );
};

export const ShowCreditAchieved = ({ courseId, doenetId }) => {
  return (
    <CheckedSetting
      courseId={courseId}
      doenetId={doenetId}
      keyToUpdate="showCreditAchievedMenu"
      description="Show Credit Achieved Menu"
    />
  );
};

export const MakePublic = ({ courseId, doenetId }) => {
  return (
    <CheckedFlag
      courseId={courseId}
      doenetId={doenetId}
      keyToUpdate="isPublic"
      description="Make Publicly Visible"
    />
  );
};

export const ShowDoenetMLSource = ({ courseId, doenetId }) => {
  return (
    <CheckedFlag
      courseId={courseId}
      doenetId={doenetId}
      keyToUpdate="userCanViewSource"
      description="Show DoenetML Source"
    />
  );
};

export const ProctorMakesAvailable = ({ courseId, doenetId }) => {
  return (
    <CheckedSetting
      courseId={courseId}
      doenetId={doenetId}
      keyToUpdate="proctorMakesAvailable"
      description="Proctor Makes Available"
    />
  );
};

export const PinAssignment = ({ courseId, doenetId }) => {
  const addToast = useToast();
  const {
    value: {
      pinnedUntilDate: recoilPinnedUntilDate,
      pinnedAfterDate: recoilPinnedAfterDate,
    },
    updateAssignmentSettings,
  } = useActivity(courseId, doenetId);

  const [pinnedUntilDate, setPinnedUntilDate] = useState(recoilPinnedUntilDate);
  const [pinnedAfterDate, setPinnedAfterDate] = useState(recoilPinnedAfterDate);

  useEffect(() => {
    setPinnedUntilDate(recoilPinnedUntilDate);
  }, [recoilPinnedUntilDate]);

  useEffect(() => {
    setPinnedAfterDate(recoilPinnedAfterDate);
  }, [recoilPinnedAfterDate]);

  return (
    <InputWrapper>
      <LabelText>Pin Assignment</LabelText>
      <InputControl onClick={(e) => e.preventDefault()}>
        <Checkbox
          style={{ marginRight: '5px' }}
          checkedIcon={<FontAwesomeIcon icon={faCalendarPlus} />}
          uncheckedIcon={<FontAwesomeIcon icon={faCalendarTimes} />}
          checked={pinnedUntilDate !== null && pinnedUntilDate !== undefined}
          onClick={() => {
            let valueDescription = 'None';
            let value = null;
            let secondValue = null;

            if (pinnedUntilDate === null || pinnedUntilDate === undefined) {
              valueDescription = 'Now to Next Year';
              let today = new Date();
              let nextYear = new Date();
              nextYear.setDate(nextYear.getDate() + 365);
              value = DateToDateString(today);
              secondValue = DateToDateString(nextYear);
            }
            setPinnedAfterDate(value);
            setPinnedUntilDate(secondValue);
            updateAssignmentSettings(
              {
                keyToUpdate: 'pinnedAfterDate',
                value,
                description: 'Pinned Dates ',
                valueDescription,
              },
              {
                keyToUpdate: 'pinnedUntilDate',
                value: secondValue,
              },
            );
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DateTime
            disabled={pinnedAfterDate === null || pinnedAfterDate === undefined}
            disabledText="No Pinned After Date"
            disabledOnClick={() => {
              let valueDescription = 'None';
              let value = null;
              let secondValue = null;

              if (pinnedAfterDate === null || pinnedAfterDate === undefined) {
                valueDescription = 'Now to Next Year';
                let today = new Date();
                let nextYear = new Date();
                nextYear.setDate(nextYear.getDate() + 365);
                value = DateToDateString(today);
                secondValue = DateToDateString(nextYear);
              }
              setPinnedAfterDate(value);
              setPinnedUntilDate(secondValue);
              updateAssignmentSettings(
                {
                  keyToUpdate: 'pinnedAfterDate',
                  value,
                  description: 'Pinned Dates ',
                  valueDescription,
                },
                {
                  keyToUpdate: 'pinnedUntilDate',
                  value: secondValue,
                },
              );
            }}
            value={pinnedAfterDate ? new Date(pinnedAfterDate) : null}
            onBlur={({ valid, value }) => {
              if (valid) {
                try {
                  value = value.toDate();
                } catch (e) {
                  // console.log('value not moment');
                }
                if (
                  new Date(DateToDateString(value)).getTime() !==
                  new Date(pinnedAfterDate).getTime()
                ) {
                  setPinnedAfterDate(DateToDateString(value));
                  updateAssignmentSettings({
                    keyToUpdate: 'pinnedAfterDate',
                    value: DateToDateString(value),
                    description: 'Pinned After Date',
                  });
                }
              } else {
                addToast('Invalid Pin After Date');
              }
            }}
          />

          <DateTime
            style={{ marginTop: '5px' }}
            disabled={pinnedUntilDate === null || pinnedUntilDate === undefined}
            disabledText="No Pinned Until Date"
            disabledOnClick={() => {
              let valueDescription = 'None';
              let value = null;
              let secondValue = null;

              if (pinnedUntilDate === null || pinnedUntilDate === undefined) {
                valueDescription = 'Now to Next Year';
                let today = new Date();
                let nextYear = new Date();
                nextYear.setDate(nextYear.getDate() + 365);
                value = DateToDateString(today);
                secondValue = DateToDateString(nextYear);
              }
              setPinnedAfterDate(value);
              setPinnedUntilDate(secondValue);
              updateAssignmentSettings(
                {
                  keyToUpdate: 'pinnedAfterDate',
                  value,
                  description: 'Pinned Dates ',
                  valueDescription,
                },
                {
                  keyToUpdate: 'pinnedUntilDate',
                  value: secondValue,
                },
              );
            }}
            value={pinnedUntilDate ? new Date(pinnedUntilDate) : null}
            onBlur={({ valid, value }) => {
              if (valid) {
                try {
                  value = value.toDate();
                } catch (e) {
                  // console.log('value not moment');
                }
                if (
                  new Date(DateToDateString(value)).getTime() !==
                  new Date(pinnedUntilDate).getTime()
                ) {
                  setPinnedUntilDate(DateToDateString(value));

                  updateAssignmentSettings({
                    keyToUpdate: 'pinnedUntilDate',
                    value: DateToDateString(value),
                    description: 'Pinned Until Date',
                  });
                }
              } else {
                addToast('Invalid Pin Until Date');
              }
            }}
          />
        </div>
      </InputControl>
    </InputWrapper>
  );
};

export function AssignTo({ courseId, doenetId }) {
  const {
    value: { isGloballyAssigned },
  } = useActivity(courseId, doenetId);

  const { value: enrolledStudents } = useRecoilValue(
    enrollmentByCourseId(courseId),
  );

  //email addresses of only those who assignment is restricted to
  const [restrictedTo, setRestrictedTo] = useState([]);

  async function getAndSetRestrictedTo({ courseId, doenetId }) {
    let resp = await axios.get('/api/getRestrictedTo.php', {
      params: { courseId, doenetId },
    });
    // console.log("resp",resp.data)
    setRestrictedTo(resp.data.restrictedTo);
  }

  async function updateRestrictedTo({ courseId, doenetId, emailAddresses }) {
    let resp = await axios.post('/api/updateRestrictedTo.php', {
      courseId,
      doenetId,
      emailAddresses,
    });
    if (resp.data.success) {
      setRestrictedTo(emailAddresses);
    }
  }

  useEffect(() => {
    if (!isGloballyAssigned) {
      getAndSetRestrictedTo({ courseId, doenetId });
    }
  }, [courseId, doenetId, isGloballyAssigned]);

  //Only those enrolled who didn't withdraw
  let enrolledJSX = enrolledStudents.reduce((allrows, row) => {
    if (row.withdrew == '0') {
      if (!isGloballyAssigned && restrictedTo.includes(row.email)) {
        return [
          ...allrows,
          <option selected key={`enrolledOpt${row.email}`} value={row.email}>
            {row.firstName} {row.lastName}
          </option>,
        ];
      } else {
        return [
          ...allrows,
          <option key={`enrolledOpt${row.email}`} value={row.email}>
            {row.firstName} {row.lastName}
          </option>,
        ];
      }
    } else {
      return allrows;
    }
  }, []);

  return (
    <>
      <CheckedFlag
        courseId={courseId}
        doenetId={doenetId}
        keyToUpdate="isGloballyAssigned"
        description="Restrict Assignment"
        invert
      />
      <RelatedItems
        width="menu"
        options={enrolledJSX}
        disabled={isGloballyAssigned}
        onChange={(e) => {
          //TODO: Clara please build this in to RelatedItems
          let emailAddresses = Array.from(
            e.target.selectedOptions,
            (option) => option.value,
          );
          updateRestrictedTo({ courseId, doenetId, emailAddresses });
        }}
        multiple
      />
    </>
  );
}
