import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function GradebookBreadCrumb() {
  const driveId = useRecoilValue(searchParamAtomFamily('driveId'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const userId = useRecoilValue(searchParamAtomFamily('userId'));
  const attemptNumber = useRecoilValue(searchParamAtomFamily('attemptNumber'));
  const source = useRecoilValue(searchParamAtomFamily('source'));
  const path = `${driveId}:${driveId}`
  return (
    <Suspense fallback={<div>loading Drive...</div>}>
      <div style={{ 
        margin: '-9px 0px 0px -25px', 
        maxWidth: '850px' }}>
        <BreadCrumb path={path} tool='Gradebook' doenetId = {doenetId} userId = {userId} attemptNumber = {attemptNumber} source = {source} />
      </div>
    </Suspense>
  );
}
