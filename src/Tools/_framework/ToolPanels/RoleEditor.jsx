import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { coursePermissionsAndSettingsByCourseId } from '../../../_reactComponents/Course/CourseActions';
import {
  AddRole,
  MangeRoles,
} from '../../../_reactComponents/Course/SettingComponents';
import { searchParamAtomFamily } from '../NewToolRoot';

const Conainer = styled.div`
  padding: 10px;
`;

export default function RolesEditor() {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const { isAdmin } = useRecoilValue(
    coursePermissionsAndSettingsByCourseId(courseId),
  );
  if (isAdmin !== '1') return null;
  return (
    <Conainer>
      <h2>Edit Role Permissons:</h2>
      <AddRole courseId={courseId} />
      <MangeRoles courseId={courseId} />
    </Conainer>
  );
}
