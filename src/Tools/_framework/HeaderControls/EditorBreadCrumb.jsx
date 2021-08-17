import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function EditorBreadCrumb() {
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));

  return (
    <Suspense fallback={<div>loading Drive...</div>}>
      <div style={{ 
        margin: '-9px 0px 0px -25px', 
        maxWidth: '850px' }}>
        <BreadCrumb  tool="Content" tool2="Editor" doenetId={doenetId} path={path}/>
      </div>
    </Suspense>
  );
}
