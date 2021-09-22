import React, { useEffect } from 'react';
import {
  atom,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { pageToolViewAtom } from '../../Tools/_framework/NewToolRoot';
// import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import { searchParamAtomFamily } from '../../Tools/_framework/NewToolRoot';
import { fetchDrivesQuery } from '../Drive/NewDrive';
import DropdownMenu from './DropdownMenu';

export const EffectiveRole = atom({
  key: 'EffectiveRole',
  default: '',
});

export default function RoleDropdown() {
  
  const [pageToolView, setPageToolView] = useRecoilState(pageToolViewAtom);
  let view_role = pageToolView.view;
  const effective_role = useRecoilValue(EffectiveRole);
  // console.log(">>>>===RoleDropdown")
  // console.log(">>>>view_role",view_role)
  console.log(">>>>effective_role",effective_role)

  const initilizeView = useRecoilCallback(({ set, snapshot }) => async () => {
    const path = await snapshot.getPromise(searchParamAtomFamily('path'));
    let [driveId] = path.split(':');
    const driveInfo = await snapshot.getPromise(fetchDrivesQuery);
    let role = 'instructor';
    for (let drive of driveInfo.driveIdsAndLabels) {
      if (drive.driveId === driveId) {
        if (drive.role.length === 1 && drive.role[0] === 'Student') {
          role = 'student';
        }
      }
    }
    set(EffectiveRole, role);
    set(pageToolViewAtom, (was) => {
      let newObj = { ...was };
      newObj.view = role;
      // console.log(">>>>initilizeView set pageToolViewAtom to",newObj)
      return newObj;
    });
  });

  useEffect(() => {
    if (view_role === '') {
      initilizeView();
    }
  }, [view_role]);
  //first time through so set view

  if (pageToolView.tool === 'enrollment'){
    return null;
  }

  if (effective_role !== 'instructor') {
    return null;
  }


  return (
    <>
    Role
    <DropdownMenu
      width="150px"
      items={[
        ['instructor', 'Instructor'],
        ['student', 'Student'],
      ]}
      title="Role"
      defaultIndex="1"
      onChange={({ value }) =>
        setPageToolView((was) => {
          let newObj = { ...was };
          newObj.view = value;
          return newObj;
        })
      }
    />
    </>
  );
}
