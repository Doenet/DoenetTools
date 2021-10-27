import { faTh } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../Tools/_framework/NewToolRoot';
import { fetchDrivesQuery, loadDriveInfoQuery, folderDictionary } from '../_reactComponents/Drive/NewDrive';

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

export function useNavigationCrumbs(driveId,folderId){

  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [crumbs,setCrumbs] = useState([])

  const getCrumbs = useRecoilCallback(({snapshot})=> async (driveId,itemId)=>{
    let itemInfo = await snapshot.getPromise(loadDriveInfoQuery(driveId));

    //Build information about folders until we get to drive
    function parentFolder({folderInfo=[], itemId}){

      if (driveId == itemId){
        return [{label:"Content"},...folderInfo];
      }

    for (let item of itemInfo.results){
      if (item.itemId == itemId){
        let newFolderInfo = [item,...folderInfo]
        return parentFolder({folderInfo:newFolderInfo,itemId:item.parentFolderId});
      }
    }

    }

    let crumbArray = [];
    for (let item of parentFolder({itemId})){

      let params = {
        path: `${driveId}:${driveId}:${driveId}:Drive`,
      }
      if (item.itemId){
        params = {
          path: `${driveId}:${item.itemId}:${item.itemId}:Folder`,
        }
      }
      crumbArray.push({
        label:item.label,
        onClick:()=>{
          setPageToolView({
            page: 'course',
            tool: 'navigation',
            view: '',
            params
          });
      }});

    }
    setCrumbs(crumbArray);
  },[setPageToolView])
    

  useEffect(()=>{
      getCrumbs(driveId,folderId);
  },[getCrumbs,driveId,folderId])


  return crumbs
}

export function useEditorCrumb({doenetId,driveId,folderId,itemId}){
  
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [label,setLabel] = useState('test')

  const getDocumentLabel = useRecoilCallback(({snapshot})=> async ({itemId,driveId,folderId})=>{
    let folderInfo = await snapshot.getPromise(folderDictionary({driveId,folderId}));
    const docInfo = folderInfo.contentsDictionary[itemId]
    setLabel(docInfo.label);
    
  },[])

  useEffect(()=>{
    getDocumentLabel({itemId,driveId,folderId});
  },[doenetId,driveId,folderId,getDocumentLabel])

  let params = {
    doenetId,
    path: `${driveId}:${folderId}:${itemId}:DoenetML`
  }

  return {label, onClick:()=>{
        setPageToolView({
          page: 'course',
          tool: 'editor',
          view: '',
          params
        });
  }}
}

export function useAssignmentCrumb({doenetId,driveId,folderId,itemId}){
  
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [label,setLabel] = useState('test')

  const getDocumentLabel = useRecoilCallback(({snapshot})=> async ({itemId,driveId,folderId})=>{
    let folderInfo = await snapshot.getPromise(folderDictionary({driveId,folderId}));
    const docInfo = folderInfo.contentsDictionary[itemId]
    setLabel(docInfo.label);
    
  },[])

  useEffect(()=>{
    getDocumentLabel({itemId,driveId,folderId});
  },[doenetId,driveId,folderId,getDocumentLabel])

  let params = {
    doenetId,
    // path: `${driveId}:${folderId}:${itemId}:DoenetML`
  }

  return {label, onClick:()=>{
        setPageToolView({
          page: 'course',
          tool: 'assignment',
          view: '',
          params
        });
  }}
}