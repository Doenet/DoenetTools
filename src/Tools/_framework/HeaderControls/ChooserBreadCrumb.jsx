import React, { Suspense } from 'react';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';
// import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';
import { faTh } from '@fortawesome/free-solid-svg-icons';

export default function ChooserBreadCrumb() {

  let crumbs = [];
  crumbs.push({icon:faTh, onClick:()=>{console.log('>>>>clicked first')}})
  crumbs.push({label:'second really really really long!!!',onClick:()=>{console.log('>>>>clicked second')}})
  crumbs.push({label:'third',onClick:()=>{console.log('>>>>clicked third')}})
  crumbs.push({label:'fourth really really really long!!!',onClick:()=>{console.log('>>>>clicked fourth')}})
  // crumbs.push({label:'fourth  really really really really really really long!!!',onClick:()=>{console.log('>>>>clicked fourth')}})
  crumbs.push({label:'fifth',onClick:()=>{console.log('>>>>clicked fifth')}})
  crumbs.push({label:'sixth really really really long!!!',onClick:()=>{console.log('>>>>clicked sixth')}})
  crumbs.push({label:'seventh',onClick:()=>{console.log('>>>>clicked seventh')}})
  crumbs.push({label:'eighth really really really long!!!',onClick:()=>{console.log('>>>>clicked eighth')}})
  crumbs.push({label:'ninth',onClick:()=>{console.log('>>>>clicked ninth')}})
  // crumbs.push({label:'ninth really really really really really really long!!!',onClick:()=>{console.log('>>>>clicked ninth')}})

  return (
    <Suspense fallback={<div>loading Breadcrumbs...</div>}>
      <BreadCrumb crumbs={crumbs} />
    </Suspense>
  );
}
