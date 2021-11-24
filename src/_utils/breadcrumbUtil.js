import { faTh } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../Tools/_framework/NewToolRoot';
import { fetchDrivesQuery, loadDriveInfoQuery, folderDictionary } from '../_reactComponents/Drive/NewDrive';
import { effectiveRoleAtom } from '../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { studentData, assignmentData } from '../Tools/_framework/ToolPanels/Gradebook';

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

export function useCollectionCrumb(doenetId,path){
  
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [label,setLabel] = useState('')

  const getDocumentLabel = useRecoilCallback(({snapshot})=> async ({path})=>{
    let [driveId,folderId] = path.split(':')
    let folderInfo = await snapshot.getPromise(folderDictionary({driveId,folderId}));
    setLabel(folderInfo.folderInfo.label);
  },[])

  useEffect(()=>{
    getDocumentLabel({path});
  },[path,getDocumentLabel])


  let params = {
    doenetId,
    path,
  }


  return {label, onClick:()=>{
        setPageToolView({
          page: 'course',
          tool: 'collection',
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
      let newFolderInfo;
      if (item.itemId == itemId){
        if (item.itemType !== 'Collection'){ 
          newFolderInfo = [item,...folderInfo]
        }
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
      console.log(">>>>nav params",params)
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
  const [label,setLabel] = useState('')

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

export function useEnrollmentCrumb(driveId){

  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  let params = {
    driveId,
  }

  return {label:'Enrollment', onClick:()=>{
        setPageToolView({
          page: 'course',
          tool: 'enrollment',
          view: '',
          params
        });
  }}
}

export function useSurveyCrumb(driveId,doenetId){

  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  
  let params = {
    driveId,
  }

  let firstCrumb = {label:'Surveys', onClick:()=>{
    setPageToolView({
      page: 'course',
      tool: 'surveyList',
      view: '',
      params
    });
}}
  if (doenetId){
    let params2 = {
      driveId,
      doenetId
    }
    return [firstCrumb,{label:'Data', onClick:()=>{
      setPageToolView({
        page: 'course',
        tool: 'surveyData',
        view: '',
        params:params2
      });
  }}]

  }else{
    return [firstCrumb]
  }
}

export function useGradebookCrumbs(){

  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [crumbs,setCrumbs] = useState([])
  const role = useRecoilValue(effectiveRoleAtom);

  const getCrumbs = useRecoilCallback(({snapshot})=> async (role)=>{
    if (role == ''){ return; } //wait for role to be defined
    let pageToolView = await snapshot.getPromise(pageToolViewAtom);
    let driveId = pageToolView.params?.driveId;
    let doenetId = pageToolView.params?.doenetId;
    let userId = pageToolView.params?.userId;
    let previousCrumb = pageToolView.params?.previousCrumb;
    
    let tool = pageToolView.tool;
    let crumbArray = []
    //Define gradebook tool crumb 
    if (role == 'instructor'){
    {
      let params = {
        driveId,
      }
      crumbArray.push({
        label:'Gradebook', onClick:()=>{
          setPageToolView({
            page: 'course',
            tool: 'gradebook',
            view: '',
            params
          });
        }
      })
    }
  }

    if (tool == 'gradebook'){
      setCrumbs(crumbArray);
      return;
    }

    //Handle gradebookStudent
   if (tool == 'gradebookStudent' ||
   role == 'student' && tool == 'gradebookStudentAssignment' ||
   previousCrumb == 'student' && tool == 'gradebookStudentAssignment'
   ){
     let label = 'Gradebook';
     if (role == 'instructor'){
        const students = await snapshot.getPromise(studentData);
        const student = students[userId];
        label = `${student.firstName} ${student.lastName}` 
     }

      let params = {
        driveId,
        userId
      }
      crumbArray.push({
        label, onClick:()=>{
          setPageToolView({
            page: 'course',
            tool: 'gradebookStudent',
            view: '',
            params
          });
    }
    })
    }

    if (tool == 'gradebookStudent'){
      setCrumbs(crumbArray);
      return;
    }

    //Only instructors see this
    if (tool == 'gradebookAssignment' ||
    previousCrumb == 'assignment' && tool == 'gradebookStudentAssignment'
    ){
      if (role == 'student'){
        crumbArray.push({label:'Not Available'})
      }else{
        const assignments = await snapshot.getPromise(assignmentData); 
        let assignmentName = assignments[doenetId].label;

        let params = {
          driveId,
          doenetId
        }
        crumbArray.push({
          label:assignmentName, onClick:()=>{
            setPageToolView({
              page: 'course',
              tool: 'gradebookAssignment',
              view: '',
              params
            });
      }
      })
      }
    }

    if (tool == 'gradebookAssignment'){
      setCrumbs(crumbArray);
      return;
    }

    //tool is gradebookStudentAssignment
    if (role == 'student'){
      const assignments = await snapshot.getPromise(assignmentData); 
        let assignmentName = assignments[doenetId].label;
        let params = {
          driveId,
          userId,
          doenetId
        }
        crumbArray.push({
          label:assignmentName, onClick:()=>{
            setPageToolView({
              page: 'course',
              tool: 'gradebookStudentAssignment',
              view: '',
              params
            });
      }
      })
    }else{
      let crumbLabel = '_';
      if (previousCrumb == 'student'){
        
        const assignments = await snapshot.getPromise(assignmentData); 
        crumbLabel = assignments[doenetId].label;
      }
      if (previousCrumb == 'assignment'){
        const students = await snapshot.getPromise(studentData);
        const student = students[userId];
        crumbLabel = `${student.firstName} ${student.lastName}` 
        
      }
  
      let params = {
        driveId,
        userId,
        doenetId,
        previousCrumb
      }
      crumbArray.push({
        label:crumbLabel, onClick:()=>{
          setPageToolView({
            page: 'course',
            tool: 'gradebookStudentAssignment',
            view: '',
            params
          });
    }
    })

    }


    setCrumbs(crumbArray);


  },[setPageToolView])
    

  useEffect(()=>{
      getCrumbs(role);
  },[getCrumbs,role])


  return crumbs
}