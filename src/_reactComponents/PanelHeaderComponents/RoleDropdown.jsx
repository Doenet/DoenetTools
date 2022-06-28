import axios from 'axios';
import React from 'react';
import {
  atom,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { pageToolViewAtom } from '../../Tools/_framework/NewToolRoot';
// import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import { searchParamAtomFamily } from '../../Tools/_framework/NewToolRoot';
import { coursePermissionsAndSettingsByCourseId } from '../Course/CourseActions';
import DropdownMenu from './DropdownMenu';

export const courseRoles = atomFamily({
  key: 'courseRoles',
  effects: (courseId) => [
    ({ trigger, setSelf }) => {
      if (trigger === 'get') {
        axios.get('api/loadCourseRoles');
        //filter to roles avaible
      }
    },
  ],
});

export const effectivePermissionsByCourseId = selectorFamily({
  key: 'effectivePermissons',
  get:
    (courseId) =>
    ({ get }) => {
      return get(coursePermissionsAndSettingsByCourseId(courseId));
    },
});

//TODO: EMILIO how does this higherarchy change? Mabye if modify roles is active? All see student?
export function RoleDropdown() {
  const { tool } = useRecoilValue(pageToolViewAtom);
  const courseId = useRecoilValue(searchParamAtomFamily('courseId')) ?? '';
  const effectivePermissions = useRecoilValue(effectivePermissionsByCourseId(courseId));

  if (tool === 'enrollment') {
    return null;
  }

  let items = [
    ['instructor', 'Instructor'],
    ['student', 'Student'],
  ];

  let defaultIndex = 0;
  // for (let [i, item] of Object.entries(items)) {
  //   if (item[0] === effectiveRole) {
  //     defaultIndex = Number(i) + 1;
  //     break;
  //   }
  // }

  return (
    <>
      Role
      <DropdownMenu
        width="menu"
        // maxMenuHeight="200px"
        items={items}
        title="Role"
        defaultIndex={defaultIndex}
        // onChange={({ value }) => setEffectiveRole(value)}
      />
    </>
  );
}
