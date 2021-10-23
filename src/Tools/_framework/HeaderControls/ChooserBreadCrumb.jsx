import React, { Suspense } from 'react';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
// import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';

export default function ChooserBreadCrumb() {

  let crumbs = [];
  crumbs.push({label:'first',onClick:()=>{console.log('>>>>clicked first')}})
  crumbs.push({label:'second',onClick:()=>{console.log('>>>>clicked second')}})
  crumbs.push({label:'third',onClick:()=>{console.log('>>>>clicked third')}})
  crumbs.push({label:'fourth',onClick:()=>{console.log('>>>>clicked fourth')}})
  crumbs.push({label:'fifth',onClick:()=>{console.log('>>>>clicked fifth')}})
  crumbs.push({label:'sixth',onClick:()=>{console.log('>>>>clicked sixth')}})
  crumbs.push({label:'seventh',onClick:()=>{console.log('>>>>clicked seventh')}})
  crumbs.push({label:'eighth',onClick:()=>{console.log('>>>>clicked eighth')}})
  crumbs.push({label:'ninth',onClick:()=>{console.log('>>>>clicked ninth')}})

  return (
    <BreadCrumb crumbs={crumbs} />
    // <Suspense fallback={<div>loading Drive...</div>}>
    //   <div style={{ 
    //     margin: '-9px 0px 0px -25px', 
    //     maxWidth: '850px' }}>
    //     <BreadCrumb tool="CourseChooser" path=":"/>
    //   </div>
    // </Suspense>
  );
}
