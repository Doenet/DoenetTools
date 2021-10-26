import React, { Suspense } from 'react';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
// import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';
// import { faTh } from '@fortawesome/free-solid-svg-icons';
import { useCourseChooserCrumb } from '../../../_utils/breadcrumbUtil';

export default function ChooserBreadCrumb() {

  const courseChooserCrumb = useCourseChooserCrumb();

  return (
    <Suspense fallback={<div>loading Breadcrumbs...</div>}>
      <BreadCrumb crumbs={[courseChooserCrumb]} />
    </Suspense>
  );
}
