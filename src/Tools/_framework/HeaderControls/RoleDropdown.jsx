import React, { useEffect } from 'react';
import {
  atom,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { pageToolViewAtom } from '../NewToolRoot';
// import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import { searchParamAtomFamily } from '../NewToolRoot';
import { fetchDrivesQuery } from '../../../_reactComponents/Drive/NewDrive';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';

const driveRole = atom({
  key: 'driveRole',
  default: '',
});

export default function RoleDropdown() {
  const [pageToolView, setPageToolView] = useRecoilState(pageToolViewAtom);
  let view_role = pageToolView.view;
  const drive_role = useRecoilValue(driveRole);
  // console.log(">>>>===RoleDropdown")
  // console.log(">>>>view_role",view_role)
  // console.log(">>>>drive_role",drive_role)

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
    set(driveRole, role);
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

  if (drive_role !== 'instructor') {
    return null;
  }

  return (
    <DropdownMenu
      absolute
      top={5}
      right={5}
      width="200px"
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
  );
}
