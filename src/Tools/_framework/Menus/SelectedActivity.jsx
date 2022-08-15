import { faFileCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toastType, useToast } from '@Toast';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState, atom } from 'recoil';
import { useActivity } from '../../../_reactComponents/Activity/ActivityActions';
import {
  AssignedDate,
  AssignTo,
  AssignUnassignActivity,
  AttemptLimit,
  AttemptAggregation,
  DueDate,
  GradeCategory,
  Individualize,
  MakePublic,
  PinAssignment,
  ProctorMakesAvailable,
  ShowCorrectness,
  ShowCreditAchieved,
  Paginate,
  ShowDoenetMLSource,
  ShowFeedback,
  ShowHints,
  ShowSolution,
  ShowSolutionInGradebook,
  TimeLimit,
  TotalPointsOrPercent,
} from '../../../_reactComponents/Activity/SettingComponents';
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
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';

export default function SelectedActivity() {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const { canEditContent } = useRecoilValue(
    effectivePermissionsByCourseId(courseId),
  );
  const { label: recoilLabel, content } = useRecoilValue(
    itemByDoenetId(doenetId),
  );
  const { renameItem, create, compileActivity, deleteItem } =
    useCourse(courseId);

  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(recoilLabel);
  const addToast = useToast();

  useEffect(() => {
    setItemTextFieldLabel(recoilLabel);
  }, [recoilLabel]);

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

  let firstPageDoenetId = findFirstPageOfActivity(content);

  let heading = (
    <h2 data-test="infoPanelItemLabel" style={{ margin: '16px 5px' }}>
      <FontAwesomeIcon icon={faFileCode} /> {recoilLabel}
    </h2>
  );

  if (canEditContent === '1') {
    return (
      <>
        {heading}
        <ActionButtonGroup vertical>
          <ActionButton
            width="menu"
            value="Edit Activity"
            data-test="Edit Activity"
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
            data-test="View Draft Activity"
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
            data-test="View Assigned Activity"
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
            data-test="Add Page"
          />
          <Button
            width="menu"
            onClick={() => create({ itemType: 'order' })}
            value="Add Order"
            data-test="Add Order"
          />
        </ButtonGroup>
        <br />

        <AssignmentSettings doenetId={doenetId} courseId={courseId} />
        <Button
          width="menu"
          value="Delete Activity"
          data-test="Delete Activity"
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

  return (
    <>
      {heading}
      <ActionButton
        width="menu"
        data-test="View Activity"
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
      <AssignmentSettings doenetId={doenetId} courseId={courseId} />
    </>
  );
}

//TODO: Emilio
const temporaryRestrictToAtom = atom({
  key: 'temporaryRestrictToAtom',
  default: [],
});

//For item we just need label and doenetId
export function AssignmentSettings({ doenetId, courseId }) {
  const { canModifyActivitySettings, canViewActivitySettings } = useRecoilValue(
    effectivePermissionsByCourseId(courseId),
  );
  const {
    value: {
      numberOfAttemptsAllowed,
      timeLimit,
      assignedDate,
      dueDate,
      totalPointsOrPercent,
    },
  } = useActivity(courseId, doenetId);

  const sharedProps = {
    courseId,
    doenetId,
    editable: canModifyActivitySettings ?? '0',
  };
  if (canViewActivitySettings === '1') {
    return (
      <>
        <AssignTo {...sharedProps} />
        <br />
        <AssignedDate {...sharedProps} />
        <DueDate {...sharedProps} />
        <TimeLimit {...sharedProps} />
        <AttemptLimit {...sharedProps} />
        <AttemptAggregation {...sharedProps} />
        <TotalPointsOrPercent {...sharedProps} />
        <GradeCategory {...sharedProps} />
        <div style={{ margin: '16px 0' }}>
          <Individualize {...sharedProps} />
          <ShowSolution {...sharedProps} />
          <ShowSolutionInGradebook {...sharedProps} />
          <ShowFeedback {...sharedProps} />
          <ShowHints {...sharedProps} />
          <ShowCorrectness {...sharedProps} />
          <ShowCreditAchieved {...sharedProps} />
          <Paginate {...sharedProps} />
          <ProctorMakesAvailable {...sharedProps} />
          <MakePublic {...sharedProps} />
          <ShowDoenetMLSource {...sharedProps} />
        </div>
        <PinAssignment {...sharedProps} />
      </>
    );
  }

  //default JSX
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
