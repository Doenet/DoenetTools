import React from 'react';
import { useRecoilValue } from 'recoil';
import BreadCrumb from '../../../_reactComponents/Breadcrumb/BreadCrumb';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function NavigationBreadCrumb() {
  const path = useRecoilValue(searchParamAtomFamily('path'));

  return (
    <div style={{ margin: '10px 20px', maxWidth: '850px' }}>
      <BreadCrumb path={path} />
    </div>
  );
}
