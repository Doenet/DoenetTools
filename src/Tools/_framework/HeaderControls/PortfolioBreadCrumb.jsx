import React, { Suspense } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { courseIdAtom, itemByDoenetId } from '../../../_reactComponents/Course/CourseActions';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';


export default function PortfolioBreadCrumb() {
  const navigate = useNavigate();
  const courseId = useRecoilValue(courseIdAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const activityObj = useRecoilValue(itemByDoenetId(doenetId));
  let { label } = activityObj;

  return (
    <Suspense fallback={<div>Loading Breadcrumb...</div>}>
      <BreadCrumb
        crumbs={[
          {label:"Portfolio",onClick:()=>{navigate(`/portfolio/${courseId}`)}},
          {label,onClick:()=>{console.log("Rename?")}},
        ]}
        offset={68}
      />
    </Suspense>
  );
}
