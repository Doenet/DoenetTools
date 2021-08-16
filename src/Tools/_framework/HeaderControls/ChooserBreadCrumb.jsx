import React, { Suspense } from 'react';
import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';

export default function ChooserBreadCrumb() {

  return (
    <Suspense fallback={<div>loading Drive...</div>}>
      <div style={{ 
        margin: '-9px 0px 0px -25px', 
        maxWidth: '850px' }}>
        <BreadCrumb tool="CourseChooser" path=":"/>
      </div>
    </Suspense>
  );
}
