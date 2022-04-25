import React from 'react';
import {
  atom,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { pageToolViewAtom } from '../../Tools/_framework/NewToolRoot';
// import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import { searchParamAtomFamily } from '../../Tools/_framework/NewToolRoot';
import { coursePermissionsAndSettingsByCourseId } from '../Course/CourseActions';
import DropdownMenu from './DropdownMenu';

export const effectiveRoleAtom = atom({
  key: 'effectiveRoleAtom',
  default: '',
});

const permittedRoleAtom = atom({
  key: 'permittedRoleAtom',
  default: '',
});

const permsForDriveIdAtom = atom({
  key: 'permsForDriveIdAtom',
  default: '',
});

export function RoleDropdown() {
  const { tool } = useRecoilValue(pageToolViewAtom);
  const [effectiveRole, setEffectiveRole] = useRecoilState(effectiveRoleAtom);
  const [permittedRole, setPermittedRole] = useRecoilState(permittedRoleAtom);
  const courseId = useRecoilValue(searchParamAtomFamily('courseId')) ?? '';
  const recoilDriveId = useRecoilValue(permsForDriveIdAtom);

  const initilizeEffectiveRole = useRecoilCallback(
    ({ set, snapshot }) =>
      async (driveId) => {
        let role = 'instructor';

        //If driveId then test if intructor is available
        if (driveId !== '') {
          let permissionsAndSettings = await snapshot.getPromise(coursePermissionsAndSettingsByCourseId(driveId));
          if (permissionsAndSettings?.roleLabels?.[0] == 'Student'){
            role = 'student';
          }
        }

        set(effectiveRoleAtom, role);
        set(permsForDriveIdAtom, driveId);
        setPermittedRole(role);
      },
    [setPermittedRole],
  );

  if (effectiveRole === '' || (recoilDriveId !== courseId && courseId !== '')) {
    //first time through so initialize
    initilizeEffectiveRole(courseId);
    return null;
  }

  if (tool === 'enrollment') {
    return null;
  }

  if (permittedRole === 'student') {
    return null;
  }

  let items = [
    ['instructor', 'Instructor'],
    ['student', 'Student'],
  ];

  let defaultIndex = 0;
  for (let [i, item] of Object.entries(items)) {
    if (item[0] === effectiveRole) {
      defaultIndex = Number(i) + 1;
      break;
    }
  }

  return (
    <>
      Role
      <DropdownMenu
        width="menu"
        // maxMenuHeight="200px"
        items={items}
        title="Role"
        defaultIndex={defaultIndex}
        onChange={({ value }) => setEffectiveRole(value)}
      />
    </>
  );
}
