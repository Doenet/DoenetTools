import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';
import { useCourseChooserCrumb, useDashboardCrumb, useGradebookCrumbs } from '../../../_utils/breadcrumbUtil';

export default function GradebookBreadCrumb() {
  const driveId = useRecoilValue(searchParamAtomFamily('driveId'));
  const courseChooserCrumb = useCourseChooserCrumb();
  const dashboardCrumb = useDashboardCrumb(driveId);
  const gradebookCrumbs = useGradebookCrumbs();

  return (
    <Suspense fallback={<div>loading Breadcrumbs...</div>}>
      <BreadCrumb crumbs={[courseChooserCrumb,dashboardCrumb,...gradebookCrumbs]}/>
    </Suspense>
  );
}


// import React, { Suspense } from 'react';
// import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
// import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';
// import { searchParamAtomFamily } from '../NewToolRoot';
// import { assignmentData, studentData } from "../../_framework/ToolPanels/Gradebook"

// export default function GradebookBreadCrumb() {
//   const driveId = useRecoilValue(searchParamAtomFamily('driveId'));
//   const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
//   const userId = useRecoilValue(searchParamAtomFamily('userId'));
//   const attemptNumber = useRecoilValue(searchParamAtomFamily('attemptNumber'));
//   const source = useRecoilValue(searchParamAtomFamily('source'));
//   const path = `${driveId}:${driveId}`

//   let assignments = useRecoilValueLoadable(assignmentData);
//   let students = useRecoilValueLoadable(studentData);

//   let legacyAssignments = {contents:{}};
//   for (let [key,value] of Object.entries(assignments.contents)){
//     legacyAssignments.contents[key] = value.label;
//   }

//   return (
//     <Suspense fallback={<div>loading Drive...</div>}>
//       <div style={{ 
//         margin: '-9px 0px 0px -25px', 
//         maxWidth: '850px' }}>
//         {assignments.state === 'hasValue' && students.state === 'hasValue' ? <BreadCrumb path={path} tool='Gradebook' doenetId = {doenetId} userId = {userId} attemptNumber = {attemptNumber} source = {source} assignments = {legacyAssignments} students = {students}/> : <p>Loading...</p>}
//       </div>
//     </Suspense>
//   );
// }
