import React, { useState } from 'react';
import {
  // useRecoilState,
  useRecoilCallback,
  useRecoilValue,
} from 'recoil';

import { searchParamAtomFamily } from '../NewToolRoot';
import { useActivity } from '../../../_reactComponents/Activity/ActivityActions';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { courseIdAtom } from '../../../_reactComponents/Course/CourseActions';
import {
  AssignedDate,
  AssignTo,
  AttemptLimit,
  AttemptAggregation,
  DueDate,
  GradeCategory,
  ItemWeights,
  Individualize,
  MakePublic,
  PinAssignment,
  ProctorMakesAvailable,
  ShowCorrectness,
  ShowCreditAchieved,
  Paginate,
  ShowFinishButton,
  ShowDoenetMLSource,
  ShowFeedback,
  ShowHints,
  ShowSolution,
  ShowSolutionInGradebook,
  TimeLimit,
  TotalPointsOrPercent,
} from '../../../_reactComponents/Activity/SettingComponents';


export default function ActivityDates() {
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const courseId = useRecoilValue(courseIdAtom);
 
  return (
    <>
      <AssignmentSettings doenetId={doenetId} courseId={courseId} />
    </>

  );
}
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
      //totalPointsOrPercent,
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
        {/* <AssignTo {...sharedProps} />
        <br />
        <AssignedDate {...sharedProps} />
        <DueDate {...sharedProps} />
        <TimeLimit {...sharedProps} />
        <AttemptLimit {...sharedProps} />
        <AttemptAggregation {...sharedProps} />
        <TotalPointsOrPercent {...sharedProps} />
        <GradeCategory {...sharedProps} />
        <ItemWeights {...sharedProps} />
        <div style={{ margin: '16px 0' }}>
          <Individualize {...sharedProps} />
          <ShowSolution {...sharedProps} />
          <ShowSolutionInGradebook {...sharedProps} />
          <ShowFeedback {...sharedProps} />
          <ShowHints {...sharedProps} />
          <ShowCorrectness {...sharedProps} />
          <ShowCreditAchieved {...sharedProps} />
          <Paginate {...sharedProps} />
          <ShowFinishButton {...sharedProps} />
          <ProctorMakesAvailable {...sharedProps} />
          <MakePublic {...sharedProps} />
          <ShowDoenetMLSource {...sharedProps} />
        </div>
        <PinAssignment {...sharedProps} /> */}
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
    assignedDateJSX = <p style={{content: "\A"}}>Assigned: {assignedDate}</p>;
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
      </div>
    </>
  );
}
