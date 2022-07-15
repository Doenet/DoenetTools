import React from 'react';
import {
  atomFamily,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { pageToolViewAtom } from '../../Tools/_framework/NewToolRoot';
import { searchParamAtomFamily } from '../../Tools/_framework/NewToolRoot';
import {
  coursePermissionsAndSettingsByCourseId,
  courseRolePermissonsByCourseIdRoleId,
  courseRolesByCourseId,
} from '../Course/CourseActions';
import DropdownMenu from './DropdownMenu';

export const effectiveRoleIdByCourseId = atomFamily({
  key: 'effectiveRoleId',
  default: null,
});

export const effectivePermissionsByCourseId = selectorFamily({
  key: 'effectivePermissons',
  get:
    (courseId) =>
    ({ get }) => {
      const roleId = get(effectiveRoleIdByCourseId(courseId));
      if (roleId !== null) {
        return get(courseRolePermissonsByCourseIdRoleId({ courseId, roleId }));
      }
      return get(coursePermissionsAndSettingsByCourseId(courseId));
    },
});

//TODO deal with unmount defult index reset
export function RoleDropdown() {
  const { tool } = useRecoilValue(pageToolViewAtom);
  const courseId = useRecoilValue(searchParamAtomFamily('courseId')) ?? '';
  const setEffectiveRoleId = useSetRecoilState(
    effectiveRoleIdByCourseId(courseId),
  );
  const roles = useRecoilValue(courseRolesByCourseId(courseId));

  if (tool === 'enrollment') {
    return null;
  }

  return (
    <>
      Role
      <DropdownMenu
        width="menu"
        maxMenuHeight="200px"
        items={roles.map(({ roleLabel, roleId }) => [roleId, roleLabel])}
        title="Role"
        defaultIndex={1}
        onChange={({ value: roleId }) => setEffectiveRoleId(roleId)}
      />
    </>
  );
}
