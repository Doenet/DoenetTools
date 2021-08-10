import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function EnrollmentBreadCrumb() {
  const driveId = useRecoilValue(searchParamAtomFamily('driveId'));
  const path = `${driveId}:${driveId}`
  return (
    <Suspense fallback={<div>loading Drive...</div>}>
      <div style={{ 
        margin: '-9px 0px 0px -25px', 
        maxWidth: '850px' }}>
        <BreadCrumb path={path} tool='Enrollment' />
      </div>
    </Suspense>
  );
}
