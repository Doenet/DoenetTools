import React, {useEffect} from 'react';
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

const driveRole = atom({
  key:"driveRole",
  default:"",
})


export default function RoleDropdown(){
  const [pageToolView,setPageToolView] = useRecoilState(pageToolViewAtom);
  let view_role = pageToolView.view;
  const drive_role = useRecoilValue(driveRole);
  // console.log(">>>>===RoleDropdown")
  // console.log(">>>>view_role",view_role)
  // console.log(">>>>drive_role",drive_role)

  const initilizeView = useRecoilCallback(({set,snapshot})=> async ()=>{
    const path = await snapshot.getPromise(searchParamAtomFamily('path'))
    let [driveId] = path.split(':')
    const driveInfo = await snapshot.getPromise(fetchDrivesQuery);
    let role = 'instructor';
    for (let drive of driveInfo.driveIdsAndLabels){
      if (drive.driveId === driveId){
        if (drive.role.length === 1 && drive.role[0] === 'Student'){
          role = 'student';
        }
      }
    }
    set(driveRole,role);
    set(pageToolViewAtom,
      (was)=>{
        let newObj = {...was}
        newObj.view = role
      // console.log(">>>>initilizeView set pageToolViewAtom to",newObj)
      return newObj
      })

  });
  useEffect(()=>{
    if (view_role === ''){
      initilizeView();
    }
  },[view_role])
    //first time through so set view
 
  if (drive_role !== 'instructor'){
    return null;
  }

  return <select 
    value={view_role}
    onChange={(e)=>setPageToolView((was)=>{
    let newObj = {...was}
    newObj.view = e.target.value
    return newObj
  })}>
    <option value='instructor'>Instructor</option>
    <option value='student'>Student</option>
  </select>
}
    // return <DropdownMenu 
  // width='200px'
  // items={[1,'Student'],[2,'Instructor']}
  // />