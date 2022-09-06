import React from 'react';
import { useRecoilValue } from 'recoil';
import { ManageUsers } from '../../../_reactComponents/Course/SettingComponents';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function ManageUsersMenu() {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  return <ManageUsers courseId={courseId} />;
}
