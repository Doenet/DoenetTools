import {
  faFileCode,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toastType, useToast } from '@Toast';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState, atom } from 'recoil';
import { useActivity } from '../../../_reactComponents/Activity/ActivityActions';
import { AssignedDate, AssignTo, AssignUnassignActivity, AttempLimit, AttemptAggregation, DueDate, GradeCategory, Individualize, MakePublic, PinAssignment, ProctorMakesAvailable, ShowCorrectness, ShowCreditAchieved, ShowDoenetMLSource, ShowFeedback, ShowHints, ShowSolution, ShowSolutionInGradebook, TimeLimit, TotalPointsOrPercent } from '../../../_reactComponents/Activity/SettingComponents';
import {
  itemByDoenetId,
  findFirstPageOfActivity,
  selectedCourseItems,
  useCourse,
} from '../../../_reactComponents/Course/CourseActions';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import ActionButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';

export default function SelectedActivity() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const {
    label: recoilLabel,
    content
  } = useRecoilValue(itemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const {
    renameItem,
    create,
    compileActivity,
    deleteItem
  } = useCourse(courseId);

  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(recoilLabel);
  const addToast = useToast();

  useEffect(() => {
    setItemTextFieldLabel(recoilLabel);
  }, [recoilLabel]);

  let firstPageDoenetId = findFirstPageOfActivity(content);

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
        <AssignmentSettings effectiveRole={effectiveRole} doenetId={doenetId} courseId={courseId}/>
      </>
    );
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

      <AssignUnassignActivity doenetId={doenetId} courseId={courseId} />
  
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
      
      <AssignmentSettings effectiveRole={effectiveRole} doenetId={doenetId} courseId={courseId} />
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
export function AssignmentSettings({ effectiveRole, doenetId, courseId }) {
  const {value: {numberOfAttemptsAllowed, timeLimit, assignedDate, dueDate, totalPointsOrPercent}} = useActivity(courseId, doenetId);
  //Student JSX
  if (effectiveRole === 'student') {
    let nAttemptsAllowed = numberOfAttemptsAllowed;
    if (nAttemptsAllowed === null) {
      nAttemptsAllowed = 'unlimited';
    }
    let timeLimitJSX = null;
    if (timeLimit !== null) {
      timeLimitJSX = <p>Time Limit: {timeLimit} minutes</p>;
    }
    let assignedDateJSX = null;
    if (assignedDate !== null) {
      assignedDateJSX = <p>Assigned: {assignedDate}</p>;
    }
    let dueDateJSX = <p>No Due Date</p>;
    if (dueDate !== null) {
      dueDateJSX = <p>Due: {dueDate}</p>;
    }
    return (
      <>
        <div>
          {assignedDateJSX}
          {dueDateJSX}
          {timeLimitJSX}
          <p>Attempts Allowed: {nAttemptsAllowed}</p>
          <p>Points: {totalPointsOrPercent}</p>
        </div>
      </>
    );
  }
  //Instructor JSX
  return (
    <>
      <AssignTo courseId={courseId} doenetId={doenetId} />
      <br />
      <AssignedDate courseId={courseId} doenetId={doenetId}/>
      <DueDate courseId={courseId} doenetId={doenetId}/>
      <TimeLimit courseId={courseId} doenetId={doenetId}/>
      <AttempLimit courseId={courseId} doenetId={doenetId}/>
      <AttemptAggregation courseId={courseId} doenetId={doenetId}/>
      <TotalPointsOrPercent courseId={courseId} doenetId={doenetId}/>
      <GradeCategory courseId={courseId} doenetId={doenetId}/>
      <div style={{ margin: '16px 0' }}>
        <Individualize courseId={courseId} doenetId={doenetId}/>
        <ShowSolution courseId={courseId} doenetId={doenetId}/>
        <ShowSolutionInGradebook courseId={courseId} doenetId={doenetId}/>
        <ShowFeedback courseId={courseId} doenetId={doenetId}/>
        <ShowHints courseId={courseId} doenetId={doenetId}/>
        <ShowCorrectness courseId={courseId} doenetId={doenetId}/>
        <ShowCreditAchieved courseId={courseId} doenetId={doenetId}/>
        <ProctorMakesAvailable courseId={courseId} doenetId={doenetId}/>
        <MakePublic courseId={courseId} doenetId={doenetId}/>
        <ShowDoenetMLSource courseId={courseId} doenetId={doenetId}/>
      </div>
      <PinAssignment courseId={courseId} doenetId={doenetId}/>
    </>
  );
}


