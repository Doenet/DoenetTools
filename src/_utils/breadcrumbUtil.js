import { faTh } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../Tools/_framework/NewToolRoot';
import { fetchDrivesQuery, loadDriveInfoQuery } from '../_reactComponents/Drive/NewDrive';

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


export function useNavigationCrumbs(driveId,itemId){
  console.log(">>>>driveId",driveId)
  console.log(">>>>itemId",itemId)
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [crumbs,setCrumbs] = useState([])

  const getCrumbs = useRecoilCallback(({snapshot})=> async (driveId,itemId)=>{
    let itemInfo = await snapshot.getPromise(loadDriveInfoQuery(driveId));

    // if (driveId === itemId){

    // }
    for (let item of itemInfo.results){
      console.log(">>>>item.itemId",item)
      // if (item.itemId === itemId){
        console.log('item',item)
        // setCrumbs((was)=>{
        //   let newArray = [...was];
        //   newArray.unshift({
        //     label:
        //   })
        //   return newArray;
        // })
        // break;
      // }
    } 
    // console.log(">>>>itemInfo",itemInfo)
    // let drives = await snapshot.getPromise(fetchDrivesQuery);
    // for (let driveIdLabel of drives.driveIdsAndLabels){
    //   if (driveIdLabel.driveId == driveId){
    //     setLabel(driveIdLabel.label);
    //     return;
    //   }
    // }
    
  })
  useEffect(()=>{
    getCrumbs(driveId,itemId);
  },[getCrumbs,driveId,itemId])

  // let params = {
  //   path: `${driveId}:${driveId}:${driveId}:Drive`,
  // }

  // return {label, onClick:()=>{
  //       setPageToolView({
  //         page: 'course',
  //         tool: 'dashboard',
  //         view: '',
  //         params
  //       });
  // }}
  console.log(">>>>crumbs",crumbs)
  return [{label:'test'}]
}