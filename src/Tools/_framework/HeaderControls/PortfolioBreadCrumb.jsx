import React, { Suspense } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { BreadCrumb } from '../../../_reactComponents/PanelHeaderComponents/BreadCrumb';


export default function PortfolioBreadCrumb() {
  const navigate = useNavigate();
  let data = useLoaderData();
  const { label, courseId } = data;

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
