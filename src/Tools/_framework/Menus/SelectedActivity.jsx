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
import { useActivity } from '../../../_reactComponents/Activity/ActivityActions';
import { AssignedDate, AttempLimit, AttemptAggregation, CheckedSetting, DueDate, GradeCategory, Individualize, PinAssignment, ShowSolution, ShowSolutionInGradebook, TimeLimit, TotalPointsOrPercent } from '../../../_reactComponents/Activity/SettingComponents';
import {
  itemByDoenetId,
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
import { recoilAddToast } from '../Toast';

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
  } = useRecoilValue(itemByDoenetId(doenetId));
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

  // useDebounce(handelLabelModfication, 500, [itemTextFieldLabel]);

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
    ({ set }) =>
      async (
        doenetId,
        ...valuesWithDescriptionsToUpdateByKey
      ) => {
        const updateObject = valuesWithDescriptionsToUpdateByKey.reduce(
          (obj, {keyToUpdate, value}) => {
            obj[keyToUpdate] = value; 
            return obj;
          },
          {}
        )

        const dateFormatKeys = ["assignedDate", "dueDate", "pinnedUntilDate", "pinnedAfterDate"];

        for (let key of dateFormatKeys) {
          if (updateObject[key] && updateObject[key] !== null) {
            updateObject[key] = DateToUTCDateString(
              new Date(updateObject[key]),
            );
          }
        }
        
        const resp = await axios.post(
          '/api/updateAssignmentSettings.php',
          { ...updateObject, courseId, doenetId },
        );

        if (resp.data.success) {
          set(itemByDoenetId(doenetId), (prev) => ({...prev, ...updateObject}));
          for (const {description, valueDescription, value, keyToUpdate} of valuesWithDescriptionsToUpdateByKey) {
            if (valueDescription) {
              recoilAddToast({set})(`Updated ${description} to ${valueDescription}`);
            } else if (description) {
              recoilAddToast({set})(
                `Updated ${description} to ${dateFormatKeys.includes(keyToUpdate) ? new Date(value).toLocaleString() : value}`,
              );
            }
          }
          
        }
      },
    [addToast, courseId],
  );

  const loadRecoilAssignmentValues = useRecoilCallback(
    ({ snapshot }) =>
      async (doenetId) => {
        const aLoadable = await snapshot.getPromise(
          itemByDoenetId(doenetId),
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
      <AssignedDate courseId={courseId} doenetId={doenetId}/>
      <DueDate courseId={courseId} doenetId={doenetId}/>
      <TimeLimit courseId={courseId} doenetId={doenetId}/>
      <AttempLimit courseId={courseId} doenetId={doenetId}/>
      <AttemptAggregation courseId={courseId} doenetId={doenetId}/>
      <TotalPointsOrPercent courseId={courseId} doenetId={doenetId}/>
      <GradeCategory courseId={courseId} doenetId={doenetId}/>
      <div style={{ margin: '16px 0' }}>
        <CheckedSetting courseId={courseId} doenetId={doenetId} keyToUpdate="individualize" description="Individualize"/>

        <CheckedSetting courseId={courseId} doenetId={doenetId} keyToUpdate="showSolution" description="Show Solution"/>

        <CheckedSetting courseId={courseId} doenetId={doenetId} keyToUpdate="showSolutionInGradebook" description="Show Solution In Gradebook"/>

        <CheckedSetting courseId={courseId} doenetId={doenetId} keyToUpdate="showFeedback" description="Show Feedback"/>

        <CheckedSetting courseId={courseId} doenetId={doenetId} keyToUpdate="showHints" description="Show Hints"/>

        <CheckedSetting courseId={courseId} doenetId={doenetId} keyToUpdate="showCorrectness" description="Show Correctness"/>
        <CheckedSetting courseId={courseId} doenetId={doenetId} keyToUpdate="showCreditAchievedMenu" description="Show Credit Achieved Menu"/>
        <CheckedSetting courseId={courseId} doenetId={doenetId} keyToUpdate="proctorMakesAvailable" description="Proctor Makes Available"/>
      </div>

      <PinAssignment courseId={courseId} doenetId={doenetId}/>
    </>
  );
}


