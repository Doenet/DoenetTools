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
  //console.log(">>> error ", folderInfo.contentsDictionaryByDoenetId)
  

  let docInfo = null

  if( doenetId !== '' && doenetId !== null && folderInfo.contentsDictionaryByDoenetId){
    docInfo = folderInfo.contentsDictionaryByDoenetId[doenetId]
  }


  if (!docInfo){
    // console.log('!!!### returned null')
    // console.log('doenetId', doenetId, 'folderInfo', folderInfo, 'contentsDictionary', folderInfo.contentsDictionaryByDoenetId)
    return null;
  
  }


  // console.log('!!!### did not return null')
  // console.log('doenetId', doenetId, 'folderInfo', folderInfo, 'contentsDictionary', folderInfo.contentsDictionaryByDoenetId)
  return (
    <Suspense fallback={<div>loading Drive...</div>}>
      <div style={{ 
        margin: '-9px 0px 0px -25px', 
        maxWidth: '850px' }}>
        <BreadCrumb  tool="Content" tool2="Editor" doenetId={doenetId} path={path} label={docInfo.label}/>
      </div>
      <p>test</p>
    </Suspense>
  );
}
