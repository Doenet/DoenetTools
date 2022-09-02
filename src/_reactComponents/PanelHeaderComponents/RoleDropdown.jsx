import React from 'react';
import { atomFamily, selectorFamily, useRecoilValue } from 'recoil';
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

export function RoleDropdown({
  label,
  width = 'menu',
  maxMenuHeight = '200px',
  defaultRoleId,
  valueRoleId,
  onChange = () => {},
  vertical,
  disabled,
}) {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId')) ?? '';
  const roles = useRecoilValue(courseRolesByCourseId(courseId));
  const valueIndex = valueRoleId
    ? roles.findIndex(({ roleId }) => roleId === valueRoleId)
    : null;
  const defaultIndex = defaultRoleId
    ? roles.findIndex(({ roleId }) => roleId === defaultRoleId)
    : null;

  return (
    <DropdownMenu
      width={width}
      maxMenuHeight={maxMenuHeight}
      items={roles.map(({ roleLabel, roleId }) => [roleId, roleLabel])}
      label={label}
      defaultIndex={defaultIndex + 1}
      valueIndex={valueIndex + 1}
      onChange={onChange}
      vertical={vertical}
      disabled={disabled}
      dataTest="RoleDropDown"
    />
  );
}
