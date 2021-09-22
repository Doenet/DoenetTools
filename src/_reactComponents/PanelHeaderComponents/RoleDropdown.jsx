import React, { useState } from 'react';
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

export const effectiveRoleAtom = atom({
  key: 'effectiveRoleAtom',
  default: '',
});

export function RoleDropdown() {
  
  const { tool } = useRecoilValue(pageToolViewAtom);
  const [effectiveRole,setEffectiveRole] = useRecoilState(effectiveRoleAtom);
  const [permittedRole,setPermittedRole ] = useState('');

  const initilizeEffectiveRole = useRecoilCallback(({ set, snapshot }) => async () => {

    let role = 'instructor';
  
    //If driveId then test if intructor is available
    const path = await snapshot.getPromise(searchParamAtomFamily('path'));
    if (path){
      let [driveId] = path.split(':');
      const driveInfo = await snapshot.getPromise(fetchDrivesQuery);
      
      for (let drive of driveInfo.driveIdsAndLabels) {
        if (drive.driveId === driveId) {
          if (drive.role.length === 1 && drive.role[0] === 'Student') {
            role = 'student';
          }
        }
      }
    }else{
      role = 'student';
    }
    
    set(effectiveRoleAtom, role);
    setPermittedRole(role);

  });

 
  if (effectiveRole === '') {
    //first time through so initialize
    initilizeEffectiveRole();
    return null;
  }

  if (tool === 'enrollment'){
    return null;
  }

  if (permittedRole !== 'instructor') {
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
      setEffectiveRole(value)
      }
    />
    </>
  );
}
