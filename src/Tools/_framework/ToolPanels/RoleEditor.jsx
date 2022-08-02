import React from 'react';
import { useRecoilValue } from 'recoil';
import { coursePermissionsAndSettingsByCourseId } from '../../../_reactComponents/Course/CourseActions';
import {
  AddRole,
  MangeRoles,
} from '../../../_reactComponents/Course/SettingComponents';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function RolesEditor() {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const { canModifyRoles } = useRecoilValue(
    coursePermissionsAndSettingsByCourseId(courseId),
  );
  if (canModifyRoles !== '1') return null;
  return (
    <>
      <h2>Edit Role Permissons:</h2>
      <MangeRoles courseId={courseId} />
      <AddRole courseId={courseId} />
    </>
  );
}
