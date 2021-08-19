import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
import { folderDictionary } from '../../../_reactComponents/Drive/NewDrive';

export default function EditorBreadCrumb() {
  const path = useRecoilValue(searchParamAtomFamily('path'));
  let [driveId,folderId] = path.split(':');
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  let folderInfo = useRecoilValue(folderDictionary({driveId,folderId}))
  const docInfo = folderInfo.contentsDictionaryByDoenetId[doenetId]
  if (!docInfo){ return null;}

  return (
    <Suspense fallback={<div>loading Drive...</div>}>
      <div style={{ 
        margin: '-9px 0px 0px -25px', 
        maxWidth: '850px' }}>
        <BreadCrumb  tool="Content" tool2="Editor" doenetId={doenetId} path={path} label={docInfo.label}/>
      </div>
    </Suspense>
  );
}
