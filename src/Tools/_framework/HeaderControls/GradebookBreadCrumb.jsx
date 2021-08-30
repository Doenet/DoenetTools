import React, { Suspense } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
import { assignmentData, studentData } from "../../_framework/ToolPanels/Gradebook"

export default function GradebookBreadCrumb() {
  const driveId = useRecoilValue(searchParamAtomFamily('driveId'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const userId = useRecoilValue(searchParamAtomFamily('userId'));
  const attemptNumber = useRecoilValue(searchParamAtomFamily('attemptNumber'));
  const source = useRecoilValue(searchParamAtomFamily('source'));
  const path = `${driveId}:${driveId}`

  let assignments = useRecoilValueLoadable(assignmentData);
  let students = useRecoilValueLoadable(studentData);

  return (
    <Suspense fallback={<div>loading Drive...</div>}>
      <div style={{ 
        margin: '-9px 0px 0px -25px', 
        maxWidth: '850px' }}>
        {assignments.state === 'hasValue' && students.state === 'hasValue' ? <BreadCrumb path={path} tool='Gradebook' doenetId = {doenetId} userId = {userId} attemptNumber = {attemptNumber} source = {source} assignments = {assignments} students = {students}/> : <p>Loading...</p>}
      </div>
    </Suspense>
  );
}
