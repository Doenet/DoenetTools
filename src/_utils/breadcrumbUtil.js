import { faTh } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../Tools/_framework/NewToolRoot';
import { fetchDrivesQuery } from '../_reactComponents/Drive/NewDrive';

export function useCourseChooserCrumb(){

  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  return {icon:faTh, onClick:()=>{
        setPageToolView({
          page: 'course',
          tool: 'courseChooser',
          view: '',
        });
  }}
}

export function useDashboardCrumb(driveId){
  
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [label,setLabel] = useState('')

  const getDriveLabel = useRecoilCallback(({snapshot})=> async (driveId)=>{
    let drives = await snapshot.getPromise(fetchDrivesQuery);
    for (let driveIdLabel of drives.driveIdsAndLabels){
      if (driveIdLabel.driveId == driveId){
        setLabel(driveIdLabel.label);
        return;
      }
    }
    
  })
  useEffect(()=>{
    getDriveLabel(driveId);
  },[driveId])

  let params = {
    path: `${driveId}:${driveId}:${driveId}:Drive`,
  }

  return {label, onClick:()=>{
        setPageToolView({
          page: 'course',
          tool: 'dashboard',
          view: '',
          params
        });
  }}
}