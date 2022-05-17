import {
  faCalendarPlus,
  faCalendarTimes,
  faCheck,
  faFileCode,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toastType, useToast } from '@Toast';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilCallback, useRecoilValue, useSetRecoilState, atom } from 'recoil';
import styled from 'styled-components';
import {
  authorItemByDoenetId,
  enrollmentByCourseId,
  findFirstPageOfActivity,
  selectedCourseItems,
  useCourse,
} from '../../../_reactComponents/Course/CourseActions';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import ActionButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Checkbox from '../../../_reactComponents/PanelHeaderComponents/Checkbox';
import DateTime from '../../../_reactComponents/PanelHeaderComponents/DateTime';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import Increment from '../../../_reactComponents/PanelHeaderComponents/IncrementMenu';
import RelatedItems from '../../../_reactComponents/PanelHeaderComponents/RelatedItems';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import {
  DateToDateString,
  DateToUTCDateString,
} from '../../../_utils/dateUtilityFunction';
import useDebounce from '../../../_utils/hooks/useDebounce';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';

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
  border:var(--canvas);
  
`;

const InputControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }
  return result;
}

export default function SelectedActivity() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const {
    label: recoilLabel,
    order,
    assignedCid,
    isAssigned,
    parentDoenetId
  } = useRecoilValue(authorItemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const {
    renameItem,
    create,
    compileActivity,
    deleteItem,
    updateAssignItem
  } = useCourse(courseId);

  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(recoilLabel);
  const addToast = useToast();

  useEffect(() => {
    setItemTextFieldLabel(recoilLabel);
  }, [recoilLabel]);

  let firstPageDoenetId = findFirstPageOfActivity(order);

  const handelLabelModfication = () => {
    let effectiveItemLabel = itemTextFieldLabel;
    if (itemTextFieldLabel === '') {
      effectiveItemLabel = recoilLabel;
      if (recoilLabel === '') {
        effectiveItemLabel = 'Untitled';
      }

      setItemTextFieldLabel(effectiveItemLabel);
      addToast('Every item must have a label.');
    }
    //Only update the server when it changes
    if (recoilLabel !== effectiveItemLabel) {
      renameItem(doenetId, effectiveItemLabel);
    }
  };

  useDebounce(handelLabelModfication, 500, [itemTextFieldLabel]);

  if (doenetId == undefined) {
    return null;
  }

  let heading = (
    <h2 data-cy="infoPanelItemLabel" style={{ margin: '16px 5px' }}>
      <FontAwesomeIcon icon={faFileCode} /> {recoilLabel}
    </h2>
  );

  if (effectiveRole === 'student') {
    return (
      <>
        {heading}
        <ActionButton
          width="menu"
          value="View Activity"
          onClick={() => {
            setPageToolView({
              page: 'course',
              tool: 'assignment',
              view: '',
              params: {
                doenetId,
              },
            });
          }}
        />
        <AssignmentSettings role={effectiveRole} doenetId={doenetId} courseId={courseId}/>
      </>
    );
  }

  let assignActivityText = 'Assign Activity';
  if (isAssigned) {
    // if (assignedCid != null) {
    assignActivityText = 'Update Assigned Activity';
  }

  
 
  return (
    <>
      {heading}
      <ActionButtonGroup vertical>
        <ActionButton
          width="menu"
          value="Edit Activity"
          onClick={() => {
            if (firstPageDoenetId == null) {
              addToast(`ERROR: No page found in activity`, toastType.INFO);
            } else {
              setPageToolView((prev) => {
                return {
                  page: 'course',
                  tool: 'editor',
                  view: prev.view,
                  params: {
                    doenetId,
                    pageId: firstPageDoenetId,
                  },
                };
              });
            }
          }}
        />
        <ActionButton
          width="menu"
          value="View Draft Activity"
          onClick={() => {
            compileActivity({
              activityDoenetId: doenetId,
              courseId,
              successCallback: () => {
                setPageToolView({
                  page: 'course',
                  tool: 'draftactivity',
                  view: '',
                  params: {
                    doenetId,
                    requestedVariant: 1,
                  },
                });
              },
            });
          }}
        />
        <ActionButton
          width="menu"
          value="View Assigned Activity"
          onClick={() => {
            setPageToolView({
              page: 'course',
              tool: 'assignment',
              view: '',
              params: {
                doenetId,
              },
            });
          }}
        />
      </ActionButtonGroup>
      <br />
      <ActionButtonGroup vertical>

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
      </ActionButtonGroup>
     
  
      <Textfield
        label="Label"
        vertical
        width="menu"
        value={itemTextFieldLabel}
        onChange={(e) => setItemTextFieldLabel(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) handelLabelModfication();
        }}
        onBlur={handelLabelModfication}
      />
      <br />
      <ButtonGroup vertical>
        <Button
          width="menu"
          onClick={() => create({ itemType: 'page' })}
          value="Add Page"
        />
        <Button
          width="menu"
          onClick={() => create({ itemType: 'order' })}
          value="Add Order"
        />
      </ButtonGroup>
      <br />
      
      <AssignmentSettings role={effectiveRole} doenetId={doenetId} courseId={courseId} />
      <Button
        width="menu"
        value="Delete Activity"
        alert
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          deleteItem({ doenetId });
        }}
      />
    </>
  );
}

//TODO: Emilio
const temporaryRestrictToAtom = atom({
  key:"temporaryRestrictToAtom",
  default:[]
})

function AssignTo({updateAssignment}){
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const {
    isGloballyAssigned
  } = useRecoilValue(authorItemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));

  const {value:enrolledStudents} = useRecoilValue(enrollmentByCourseId(courseId))

  //email addresses of only those who assignment is restricted to
  const [restrictedTo,setRestrictedTo] = useState([]);

  async function getAndSetRestrictedTo({courseId,doenetId}){
    let resp = await axios.get('/api/getRestrictedTo.php',{params:{courseId,doenetId}})
    // console.log("resp",resp.data)
    setRestrictedTo(resp.data.restrictedTo)
  }

  async function updateRestrictedTo({courseId,doenetId,emailAddresses}){

    let resp = await axios.post('/api/updateRestrictedTo.php',{courseId,doenetId,emailAddresses})
    // console.log("resp",resp.data)
    setRestrictedTo(emailAddresses)
  }

  useEffect(()=>{
    if (!isGloballyAssigned){
      getAndSetRestrictedTo({courseId,doenetId})
    }
  },[doenetId,isGloballyAssigned])


  //Only those enrolled who didn't withdraw
  let enrolledJSX = enrolledStudents.reduce((allrows,row)=>{
    if (row.withdrew == '0'){
      if (!isGloballyAssigned && restrictedTo.includes(row.email)){
        return [...allrows,<option selected key={`enrolledOpt${row.email}`} value={row.email}>{row.firstName} {row.lastName}</option>]
      }else{
        return [...allrows,<option key={`enrolledOpt${row.email}`} value={row.email}>{row.firstName} {row.lastName}</option>]
      }
    }else{
      return allrows
    }
  },[])

  return <>
   <br />
      <InputWrapper>
  
          <Checkbox
            style={{ marginRight: '5px' }}
            checked={!isGloballyAssigned}
            onClick={() => {
              updateAssignment({
                doenetId,
                keyToUpdate: 'isGloballyAssigned',
                value:!isGloballyAssigned,
                description: 'Restrict Assignment ',
                valueDescription:isGloballyAssigned ? "true": "false",
              });
    
            }}
          />
        <LabelText>Restrict Assignment To</LabelText>

         </InputWrapper> 
         <RelatedItems
            width="menu"
            options={enrolledJSX}
            disabled={isGloballyAssigned}
            onChange={(e)=>{
              //TODO: Clara please build this in to RelatedItems
              let emailAddresses = Array.from(e.target.selectedOptions, option => option.value);

              updateRestrictedTo({courseId,doenetId,emailAddresses})
              
            }}
            multiple
          />
  </>
}

//For item we just need label and doenetId
export function AssignmentSettings({ role, doenetId, courseId }) {
  //Use aInfo to check if values have changed
  let aInfoRef = useRef({});
  const aInfo = aInfoRef?.current;

  const addToast = useToast();
  //Note if aLoadable is not loaded then these will default to undefined
  let [assignedDate, setAssignedDate] = useState('');
  let [dueDate, setDueDate] = useState('');
  let [pinnedUntilDate, setPinnedUntilDate] = useState('');
  let [pinnedAfterDate, setPinnedAfterDate] = useState('');
  let [limitAttempts, setLimitAttempts] = useState(true);
  let [numberOfAttemptsAllowed, setNumberOfAttemptsAllowed] = useState(1);
  let [timeLimit, setTimeLimit] = useState(60);
  let [attemptAggregation, setAttemptAggregation] = useState('');
  let [totalPointsOrPercent, setTotalPointsOrPercent] = useState(100);
  let [gradeCategory, setGradeCategory] = useState('');
  let [individualize, setIndividualize] = useState(true);
  let [showSolution, setShowSolution] = useState(true);
  let [showSolutionInGradebook, setShowSolutionInGradebook] = useState(true);
  let [showFeedback, setShowFeedback] = useState(true);
  let [showHints, setShowHints] = useState(true);
  let [showCorrectness, setShowCorrectness] = useState(true);
  let [showCreditAchievedMenu, setShowCreditAchievedMenu] = useState(true);
  let [proctorMakesAvailable, setProctorMakesAvailable] = useState(true);

  const updateAssignment = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({
        doenetId,
        keyToUpdate,
        value,
        description,
        valueDescription = null,
        secondKeyToUpdate = null,
        secondValue,
      }) => {
        const oldAInfo = await snapshot.getPromise(
          authorItemByDoenetId(doenetId),
        );
        let newAInfo = { ...oldAInfo, courseId, [keyToUpdate]: value };

        if (secondKeyToUpdate) {
          newAInfo[secondKeyToUpdate] = secondValue;
        }

        let dbAInfo = { ...newAInfo };
        dbAInfo.assignedDate = dbAInfo?.assignedDate ?? null;
        dbAInfo.dueDate = dbAInfo?.dueDate ?? null;
        dbAInfo.pinnedUntilDate = dbAInfo?.pinnedUntilDate ?? null;
        dbAInfo.pinnedAfterDate = dbAInfo?.pinnedAfterDate ?? null;

        if (dbAInfo.assignedDate !== null) {
          dbAInfo.assignedDate = DateToUTCDateString(
            new Date(dbAInfo.assignedDate),
          );
        }

        if (dbAInfo.dueDate !== null) {
          dbAInfo.dueDate = DateToUTCDateString(new Date(dbAInfo.dueDate));
        }

        if (dbAInfo.pinnedUntilDate !== null) {
          dbAInfo.pinnedUntilDate = DateToUTCDateString(
            new Date(dbAInfo.pinnedUntilDate),
          );
        }

        if (dbAInfo.pinnedAfterDate !== null) {
          dbAInfo.pinnedAfterDate = DateToUTCDateString(
            new Date(dbAInfo.pinnedAfterDate),
          );
        }

        const resp = await axios.post(
          '/api/saveAssignmentToDraft.php',
          dbAInfo,
        );

        if (resp.data.success) {
          set(authorItemByDoenetId(doenetId), newAInfo);
          if (valueDescription) {
            addToast(`Updated ${description} to ${valueDescription}`);
          } else {
            if (
              description === 'Assigned Date' ||
              description === 'Due Date' ||
              description === 'Pinned Until Date' ||
              description === 'Pinned After Date'
            ) {
              addToast(
                `Updated ${description} to ${new Date(value).toLocaleString()}`,
              );
            } else {
              addToast(`Updated ${description} to ${value}`);
            }
          }
        }
        // set(loadAssignmentSelector(doenetId),(was)=>{
        //   return {...was,[keyToUpdate]:value}
        // });
      },
    [addToast, courseId],
  );

  const loadRecoilAssignmentValues = useRecoilCallback(
    ({ snapshot }) =>
      async (doenetId) => {
        const aLoadable = await snapshot.getPromise(
          authorItemByDoenetId(doenetId),
        );

        aInfoRef.current = { ...aLoadable };

        setAssignedDate(aLoadable?.assignedDate);
        setDueDate(aLoadable?.dueDate);
        setLimitAttempts(aLoadable?.numberOfAttemptsAllowed !== null);
        setNumberOfAttemptsAllowed(aLoadable?.numberOfAttemptsAllowed);
        setAttemptAggregation(aLoadable?.attemptAggregation);
        setTotalPointsOrPercent(aLoadable?.totalPointsOrPercent);
        setGradeCategory(aLoadable?.gradeCategory);
        setIndividualize(aLoadable?.individualize);
        setShowSolution(aLoadable?.showSolution);
        setShowSolutionInGradebook(aLoadable?.showSolutionInGradebook);
        setShowFeedback(aLoadable?.showFeedback);
        setShowHints(aLoadable?.showHints);
        setShowCorrectness(aLoadable?.showCorrectness);
        setShowCreditAchievedMenu(aLoadable?.showCreditAchievedMenu);
        setProctorMakesAvailable(aLoadable?.proctorMakesAvailable);
        setTimeLimit(aLoadable?.timeLimit);
        setPinnedUntilDate(aLoadable?.pinnedUntilDate);
        setPinnedAfterDate(aLoadable?.pinnedAfterDate);
      },
    [],
  );

  if (Object.keys(aInfo).length === 0) {
    loadRecoilAssignmentValues(doenetId);
    return null;
  }

  //Student JSX
  if (role === 'student') {
    let nAttemptsAllowed = aInfo?.numberOfAttemptsAllowed;
    if (nAttemptsAllowed === null) {
      nAttemptsAllowed = 'unlimited';
    }
    let timeLimitJSX = null;
    if (aInfo?.timeLimit !== null) {
      timeLimitJSX = <p>Time Limit: {aInfo?.timeLimit} minutes</p>;
    }
    let assignedDateJSX = null;
    if (aInfo?.assignedDate !== null) {
      assignedDateJSX = <p>Assigned: {aInfo?.assignedDate}</p>;
    }
    let dueDateJSX = <p>No Due Date</p>;
    if (aInfo?.dueDate !== null) {
      dueDateJSX = <p>Due: {aInfo?.dueDate}</p>;
    }
    return (
      <>
        <div>
          {assignedDateJSX}
          {dueDateJSX}
          {timeLimitJSX}
          <p>Attempts Allowed: {nAttemptsAllowed}</p>
          <p>Points: {aInfo?.totalPointsOrPercent}</p>
        </div>
      </>
    );
  }
  //Instructor JSX
  return (
    <>
    <AssignTo updateAssignment={updateAssignment} />
    <br />
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

              updateAssignment({
                doenetId,
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
              setAssignedDate(value);

              updateAssignment({
                doenetId,
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

                  updateAssignment({
                    doenetId,
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

              updateAssignment({
                doenetId,
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
                  updateAssignment({
                    doenetId,
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
              updateAssignment({
                doenetId,
                keyToUpdate: 'dueDate',
                value,
                description: 'Due Date',
                valueDescription,
              });
            }}
          />
        </InputControl>
      </InputWrapper>
      <InputWrapper>
        <LabelText>Time Limit</LabelText>
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
              updateAssignment({
                doenetId,
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
              if (aInfo.timeLimit !== timeLimit) {
                let timelimitlocal = null;
                if (timeLimit < 0 || timeLimit === '' || isNaN(timeLimit)) {
                  setTimeLimit(0);
                  timelimitlocal = 0;
                } else {
                  timelimitlocal = parseInt(timeLimit);
                  setTimeLimit(parseInt(timeLimit));
                }
                let valueDescription = `${timelimitlocal} Minutes`;

                updateAssignment({
                  doenetId,
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

      <InputWrapper>
        <LabelText>Attempts</LabelText>
        <InputControl onClick={(e) => e.preventDefault()}>
          <Checkbox
            style={{ marginRight: '5px' }}
            checked={limitAttempts !== null}
            onClick={() => {
              let valueDescription = 'Not Limited';
              let value = null;
              if (limitAttempts === null) {
                valueDescription = '1';
                value = 1;
              }
              setLimitAttempts(value);
              setNumberOfAttemptsAllowed(value);
              updateAssignment({
                doenetId,
                keyToUpdate: 'numberOfAttemptsAllowed',
                value,
                description: 'Attempts Allowed ',
                valueDescription,
              });
            }}
          />
          <Increment
            disabled={limitAttempts === null}
            value={numberOfAttemptsAllowed}
            min={0}
            onBlur={() => {
              if (aInfo.numberOfAttemptsAllowed !== numberOfAttemptsAllowed) {
                let numberOfAttemptsAllowedLocal = null;
                if (
                  numberOfAttemptsAllowed < 0 ||
                  numberOfAttemptsAllowed === '' ||
                  isNaN(numberOfAttemptsAllowed)
                ) {
                  setNumberOfAttemptsAllowed(0);
                  numberOfAttemptsAllowedLocal = 0;
                } else {
                  numberOfAttemptsAllowedLocal = parseInt(
                    numberOfAttemptsAllowed,
                  );
                  setNumberOfAttemptsAllowed(parseInt(numberOfAttemptsAllowed));
                }

                updateAssignment({
                  doenetId,
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
              updateAssignment({
                doenetId,
                keyToUpdate: 'attemptAggregation',
                value: val,
                description: 'Attempt Aggregation',
                valueDescription,
              });
            }}
          />
        </InputControl>
      </InputWrapper>
      <InputWrapper>
        <LabelText>Total Points Or Percent</LabelText>
        <InputControl>
          <Increment
            value={totalPointsOrPercent}
            min={0}
            onBlur={() => {
              if (aInfo.totalPointsOrPercent !== totalPointsOrPercent) {
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

                updateAssignment({
                  doenetId,
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
            console.log('on change');
            if (aInfo.gradeCategory !== val) {
              aInfoRef.current.gradeCategory = val;
              setGradeCategory(val);
              updateAssignment({
                doenetId,
                keyToUpdate: 'gradeCategory',
                value: val,
                description: 'Grade Category',
              });
            }
          }}
        />
      </InputWrapper>

      <div style={{ margin: '16px 0' }}>
        <InputWrapper flex>
          <div onClick={(e) => e.preventDefault()}>
            <Checkbox
              style={{ marginRight: '5px' }}
              checked={individualize}
              onClick={() => {
                let valueDescription = 'False';
                let value = false;
                if (!individualize) {
                  valueDescription = 'True';
                  value = true;
                }
                setIndividualize(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'individualize',
                  value: value,
                  description: 'Individualize',
                  valueDescription,
                });
              }}
            />
            <CheckboxLabelText>Individualize</CheckboxLabelText>
          </div>
        </InputWrapper>

        <InputWrapper flex>
          <div onClick={(e) => e.preventDefault()}>
            <Checkbox
              style={{ marginRight: '5px' }}
              checked={showSolution}
              onClick={() => {
                let valueDescription = 'False';
                let value = false;
                if (!showSolution) {
                  valueDescription = 'True';
                  value = true;
                }
                setShowSolution(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'showSolution',
                  value: value,
                  description: 'Show Solution',
                  valueDescription,
                });
              }}
            />
            <CheckboxLabelText>Show Solution</CheckboxLabelText>
          </div>
        </InputWrapper>

        <InputWrapper flex>
          <Checkbox
            style={{ marginRight: '5px' }}
            checked={showSolutionInGradebook}
            onClick={() => {
              let valueDescription = 'False';
              let value = false;
              if (!showSolutionInGradebook) {
                valueDescription = 'True';
                value = true;
              }
              setShowSolutionInGradebook(value);
              updateAssignment({
                doenetId,
                keyToUpdate: 'showSolutionInGradebook',
                value: value,
                description: 'Show Solution In Gradebook',
                valueDescription,
              });
            }}
          />
          <CheckboxLabelText>Show Solution In Gradebook</CheckboxLabelText>
        </InputWrapper>

        <InputWrapper flex>
          <Checkbox
            style={{ marginRight: '5px' }}
            checked={showFeedback}
            onClick={() => {
              let valueDescription = 'False';
              let value = false;
              if (!showFeedback) {
                valueDescription = 'True';
                value = true;
              }
              setShowFeedback(value);
              updateAssignment({
                doenetId,
                keyToUpdate: 'showFeedback',
                value: value,
                description: 'Show Feedback',
                valueDescription,
              });
            }}
          />
          <CheckboxLabelText>Show Feedback</CheckboxLabelText>
        </InputWrapper>

        <InputWrapper flex>
          <Checkbox
            style={{ marginRight: '5px' }}
            checked={showHints}
            onClick={() => {
              let valueDescription = 'False';
              let value = false;
              if (!showHints) {
                valueDescription = 'True';
                value = true;
              }
              setShowHints(value);
              updateAssignment({
                doenetId,
                keyToUpdate: 'showHints',
                value: value,
                description: 'Show Hints',
                valueDescription,
              });
            }}
          />
          <CheckboxLabelText>Show Hints</CheckboxLabelText>
        </InputWrapper>

        <InputWrapper flex>
          <Checkbox
            style={{ marginRight: '5px' }}
            checked={showCorrectness}
            onClick={() => {
              let valueDescription = 'False';
              let value = false;
              if (!showCorrectness) {
                valueDescription = 'True';
                value = true;
              }
              setShowCorrectness(value);
              updateAssignment({
                doenetId,
                keyToUpdate: 'showCorrectness',
                value: value,
                description: 'Show Correctness',
                valueDescription,
              });
            }}
          />
          <CheckboxLabelText>Show Correctness</CheckboxLabelText>
        </InputWrapper>

        <InputWrapper flex>
          <Checkbox
            style={{ marginRight: '5px' }}
            checked={showCreditAchievedMenu}
            onClick={() => {
              let valueDescription = 'False';
              let value = false;
              if (!showCreditAchievedMenu) {
                valueDescription = 'True';
                value = true;
              }
              setShowCreditAchievedMenu(value);
              updateAssignment({
                doenetId,
                keyToUpdate: 'showCreditAchievedMenu',
                value: value,
                description: 'Show Credit Achieved Menu',
                valueDescription,
              });
            }}
          />
          <CheckboxLabelText>Show Credit Achieved Menu</CheckboxLabelText>
        </InputWrapper>

        <InputWrapper flex>
          <Checkbox
            style={{ marginRight: '5px' }}
            checked={proctorMakesAvailable}
            onClick={() => {
              let valueDescription = 'False';
              let value = false;
              if (!proctorMakesAvailable) {
                valueDescription = 'True';
                value = true;
              }
              setProctorMakesAvailable(value);
              updateAssignment({
                doenetId,
                keyToUpdate: 'proctorMakesAvailable',
                value: value,
                description: 'Proctor Makes Available',
                valueDescription,
              });
            }}
          />
          <CheckboxLabelText>Proctor Makes Available</CheckboxLabelText>
        </InputWrapper>
      </div>

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
              updateAssignment({
                doenetId,
                keyToUpdate: 'pinnedAfterDate',
                value,
                description: 'Pinned Dates ',
                valueDescription,
                secondKeyToUpdate: 'pinnedUntilDate',
                secondValue,
              });
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <DateTime
              disabled={
                pinnedAfterDate === null || pinnedAfterDate === undefined
              }
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
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'pinnedAfterDate',
                  value,
                  description: 'Pinned Dates ',
                  valueDescription,
                  secondKeyToUpdate: 'pinnedUntilDate',
                  secondValue,
                });
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
                    updateAssignment({
                      doenetId,
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
              disabled={
                pinnedUntilDate === null || pinnedUntilDate === undefined
              }
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
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'pinnedAfterDate',
                  value,
                  description: 'Pinned Dates ',
                  valueDescription,
                  secondKeyToUpdate: 'pinnedUntilDate',
                  secondValue,
                });
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

                    updateAssignment({
                      doenetId,
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
    </>
  );
}
