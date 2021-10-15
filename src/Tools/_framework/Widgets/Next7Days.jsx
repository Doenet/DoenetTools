/**
 * External dependencies
 */
import React, { useState, Suspense, useEffect, useLayoutEffect } from 'react';
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  atom,
} from 'recoil';
/**
 * Internal dependencies
 */
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
import {
  selectedDriveAtom,
  selectedDriveItems,
  itemType,
  clearDriveAndItemSelections,
  folderDictionary,
  DoenetML,
  DriveHeader,
} from '../../../_reactComponents/Drive/NewDrive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLessThan,
  faGreaterThan
} from '@fortawesome/free-solid-svg-icons';

// import { DropTargetsProvider } from '../../../_reactComponents/DropTarget';
// import { BreadcrumbProvider } from '../../../_reactComponents/Breadcrumb/BreadcrumbProvider';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
// import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import axios from 'axios';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';

//array of objects
//dotwIndex as a number starting at 0 for Sunday (the js standard)
//startTime as text "01:00"
//endTime as text "02:00"
export const classTimesAtom = atom({
  key:'classTimesAtom',
  default:[]
})

//boolean
export const showCompletedAtom = atom({
  key:'showCompletedAtom',
  default:true
})
//boolean
export const showOverdueAtom = atom({
  key:'showOverdueAtom',
  default:true
})

function formatAssignedDate(dt,classTimes,dueDT,thisWeek){
  //If we don't have a dt datetime then return null
  if (dt == 'Invalid Date' || dt == null){ return null; }
  //After Class and In Class
  let dtDOTW = dt.getDay();
  for (let classTime of classTimes){
  //Only process if it's the right day of the week
    if (classTime.dotwIndex == dtDOTW){
      let classStartDT = new Date(dt.getTime());
      const [starthours,startminutes] = classTime.startTime.split(":");
      classStartDT.setHours(starthours,startminutes,0,0);
      let classEndDT = new Date(dt.getTime());
      const [endhours,endminutes] = classTime.endTime.split(":");
      classEndDT.setHours(endhours,endminutes,0,0);
      
      if (dt >= classStartDT && dt < classEndDT){
        if (dt.getMonth() != dueDT.getMonth() || dt.getDate() != dueDT.getDate()){
          return `In Class ${dt.getMonth()+1}/${dt.getDate()}`
        }
        
        return "In Class";
      }else if (dt.getTime() == classEndDT.getTime()){
        if (dt.getMonth() != dueDT.getMonth() || dt.getDate() != dueDT.getDate()){
          return `After Class ${dt.getMonth()+1}/${dt.getDate()}`
        }
        return "After Class";
      }
    }

  }

  let time = dt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  if (time === 'Invalid Date'){ time = null; }

  //This week only
  if (thisWeek){
    let today = new Date();
    let yesterday = new Date(today.getTime() + (1000 * 60 * 60 * 24 * -1));
    let tomorrow = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 1));

    //Yesterday - time
    if (dt.getMonth() == yesterday.getMonth() && 
        dt.getDate() == yesterday.getDate() &&
        dt.getFullYear() == yesterday.getFullYear()){
          return `Yesterday - ${time}`
    }

    if (dt.getMonth() == tomorrow.getMonth() && 
        dt.getDate() == tomorrow.getDate() &&
        dt.getFullYear() == tomorrow.getFullYear()){
          return `Tomorrow - ${time}`
    }

    //Day of the Week
    const dotwLabel = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    return `${dotwLabel[dt.getDay()]} - ${time}`

  }
  
  let returnValue = `${dt.getMonth() + 1}/${dt.getDate()} ${time}`
  if (time === null){ returnValue = null;}

 return returnValue;
}

function formatDueDate(dt,classTimes){
  if (dt == 'Invalid Date' || dt == null){ return null; }
 
  //End of Class and Before Class
    let dtDOTW = dt.getDay();
  for (let classTime of classTimes){
    //Only process if it's the right day of the week
    if (classTime.dotwIndex == dtDOTW){
      let classStartDT = new Date(dt.getTime());
      const [starthours,startminutes] = classTime.startTime.split(":");
      classStartDT.setHours(starthours,startminutes,0,0);
      let classEndDT = new Date(dt.getTime());
      const [endhours,endminutes] = classTime.endTime.split(":");
      classEndDT.setHours(endhours,endminutes,0,0);
      if (dt >= classStartDT && dt < classEndDT){
        return "In Class";
      }else 
      
      if (dt.getTime() == classEndDT.getTime()){
        return "End of Class";
      }
    }
  }
 
  // console.log(">>>>formatDueDate dt",dt)
  let returnValue = dt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  returnValue = `${dt.getMonth() + 1}/${dt.getDate()} ${returnValue}`;
  if (returnValue === 'Invalid Date'){ returnValue = null;}

 return returnValue;
}

function buildRows({
  dotw="",
  rowLabel="",
  assignments,
  clickCallback,
  doubleClickCallback,
  completedArray,
  setCompletedArray,
  classTimes,
  weekShift,
  selectedItemId,
  showCompleted
}){
  let newRows = [];
  if (assignments.length > 0){

    let isFirstRow = true;
    let numberOfVisibleRows = 0;
    for (let assignment of assignments){
      let checked = completedArray.includes(assignment.doenetId)

      if (showCompleted || (!showCompleted && !checked)){
        numberOfVisibleRows++;
      }
    }
    //if more than one item loop through the rest
    for (let i = 0; i < assignments.length; i++){
      let assignment = assignments[i];

      let assignedDate = new Date(`${assignment.assignedDate} UTC`)
      assignedDate.setSeconds(0,0);
      let dueDate = new Date(`${assignment.dueDate} UTC`);
      dueDate.setSeconds(0,0);

      let effectiveRowLabel = `${dotw} ${dueDate.getMonth() + 1}/${dueDate.getDate()}`
      if (rowLabel !== ""){
        effectiveRowLabel = rowLabel;
      }
      let displayDueDate = formatDueDate(dueDate,classTimes) 

      let displayAssignedDate = formatAssignedDate(assignedDate,classTimes,dueDate,weekShift == 0)   
      
      let bgColor = null;
      if (assignment.itemId === selectedItemId){
        bgColor = '#B8D2EA'; 
      }
      let oneClick = (e)=>{
        e.stopPropagation();
        clickCallback({
        driveId: assignment.driveId,
        itemId:assignment.itemId,
        driveInstanceId: 'currentContent',
        type:assignment.itemType,
        instructionType: 'one item',
        parentFolderId: assignment.parentFolderId,
      })
    }
    let path = `${assignment.driveId}:${assignment.parentFolderId}:${assignment.itemId}:${assignment.itemType}`
    let doubleClick = ()=>doubleClickCallback({type:assignment.itemType,doenetId:assignment.doenetId,path})
    let checked = completedArray.includes(assignment.doenetId)

    if (!showCompleted && checked){
      continue;
    }

    let checkbox = <input type='checkbox' checked={checked} onClick={(e)=>{
      e.stopPropagation();
    if (checked){
      setCompletedArray((was)=>{
        let newObj = [...was];
        newObj.splice(newObj.indexOf(assignment.doenetId),1)
        return newObj;
      })
    }else{
      setCompletedArray((was)=>{
        let newObj = [assignment.doenetId,...was]
        return newObj;
      })
    }

    axios.get('/api/saveCompleted.php',{params:{doenetId:assignment.doenetId}})
    // .then(({data})=>{
      // console.log(">>>>data",data)
    // })
   
      }
    }/>
    if (isFirstRow){
          isFirstRow = false;

      newRows.push(<tr key={`${effectiveRowLabel}${assignment.doenetId}`} >
          <td rowSpan={numberOfVisibleRows}>{effectiveRowLabel}</td>
          <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{assignment.label}</td>
          <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{displayAssignedDate}</td>
          <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{displayDueDate}</td>
          <td style={{backgroundColor:bgColor,textAlign:"center"}}  >{checkbox}</td>
          </tr>)
    }else{
      newRows.push(<tr key={`${effectiveRowLabel}${assignment.doenetId}${i}`}>
          <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{assignment.label}</td>
          <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{displayAssignedDate}</td>
          <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{displayDueDate}</td>
          <td style={{backgroundColor:bgColor,textAlign:"center"}}  >{checkbox}</td>
          </tr>)
    }
     
    }
  }
  return newRows;
}

export default function Next7Days({ driveId }) {
  
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const showCompleted = useRecoilValue(showCompletedAtom);
  const showOverdue = useRecoilValue(showOverdueAtom);

  // const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  // let [numColumns,setNumColumns] = useState(4);
  let [assignmentArray,setAssignmentArray] = useState([]);
  let [pinnedArray,setPinnedArray] = useState([]);
  let [completedArray,setCompletedArray] = useState([]);
  let [initialized,setInitialized] = useState(false);
  let [problemMessage,setProblemMessage] = useState("");
  let [weekShift,setWeekShift] = useState(0); //-1 means 7 days before
  let classTimes = useRecoilValue(classTimesAtom);
  let selected = useRecoilValue(globalSelectedNodesAtom);
  let selectedItemId = null;
  if (selected[0]?.driveInstanceId === "currentContent"){
    selectedItemId = selected[0].itemId;
  }

  let loadAssignmentArray = useRecoilCallback(({set})=> async (driveId)=>{
    //Clear selection when click on main panel
    set(mainPanelClickAtom,(was)=>[
      ...was,
      { atom: clearDriveAndItemSelections, value: null },
      { atom: selectedMenuPanelAtom, value: null },
    ])

    const { data } = await axios.get('/api/loadTODO.php',{params:{driveId}});
    if (!data.success){
      setProblemMessage(data.message);
      return
    }
    if (data.assignments){
      setAssignmentArray(data.assignments);
      setPinnedArray(data.pinned);
    }
    if (data.classTimes){
      set(classTimesAtom,data.classTimes);
    }
    if (data.completed){
      setCompletedArray(data.completed);
    }

  })

  const clickCallback = useRecoilCallback(
    ({ set }) =>
      (info) => {
        switch (info.instructionType) {
          case 'one item':
            set(selectedMenuPanelAtom, `Selected${info.type}`);
            break;
          case 'range to item':
          case 'add item':
            set(selectedMenuPanelAtom, `SelectedMulti`);
            break;
          case 'clear all':
            set(selectedMenuPanelAtom, null);
            break;
          default:
            throw new Error('NavigationPanel found invalid select instruction');
        }
        set(
          selectedDriveItems({
            driveId: info.driveId,
            driveInstanceId: info.driveInstanceId,
            itemId: info.itemId,
          }),
          {
            instructionType: info.instructionType,
            parentFolderId: info.parentFolderId,
          },
        );
        set(selectedDriveAtom, info.driveId);
      },
    [],
  );

  const doubleClickCallback = useRecoilCallback(
    ({snapshot}) => async ({type,doenetId,path}) => {

        let role = await snapshot.getPromise(effectiveRoleAtom);
 
        if (role === 'instructor'){

          switch (type) {
            case itemType.DOENETML:
            
                //TODO: VariantIndex params
                setPageToolView({
                  page: 'course',
                  tool: 'editor',
                  view: '',
                  params: {
                    doenetId,
                        path,
                  },
                });
             
  
              break;
            case itemType.COLLECTION:
  
                setPageToolView({
                  page: 'course',
                  tool: 'editor',
                  view: '',
                  params: {
                    doenetId,
                    path,
                    isCollection: true,
                  },
                });
            
              break;
            default:
              throw new Error(
                'NavigationPanel doubleClick info type not defined',
              );
            }
        

        }else{
          //role: student

          switch (type) {
          case itemType.DOENETML:
          
              //TODO: VariantIndex params
              setPageToolView({
                page: 'course',
                tool: 'assignment',
                view: '',
                params: {
                  doenetId,
                },
              });
           

            break;
          case itemType.COLLECTION:

              setPageToolView({
                page: 'course',
                tool: 'assignment',
                view: '',
                params: {
                  doenetId,
                  isCollection: true,
                },
              });
          
            break;
          default:
            throw new Error(
              'NavigationPanel doubleClick info type not defined',
            );
          }
        }
        
      },
    [setPageToolView],
  );

  if (!initialized && driveId !== ""){
    //Runs every time the page is returned to
    setInitialized(true)//prevent load on each refresh
    loadAssignmentArray(driveId);
    return null;
  }

  if (problemMessage !== ''){
    return <div>
      <h2>{problemMessage}</h2>
    </div>
  }

  // let today = new Date();
  let today = new Date('10/17/2021');
  let diff = 1 - today.getDay();
  if (diff === 1){ diff = -6} //Start week on Monday
  let monday = new Date(today.getTime() + (1000 * 60 * 60 * 24 * diff) + (1000 * 60 * 60 * 24 * weekShift * 7) );
  let sunday = new Date(monday.getTime() + (1000 * 60 * 60 * 24 * 6));
  let headerMonday = `${monday.getMonth() + 1}/${monday.getDate()}`
  let headerSunday = `${sunday.getMonth() + 1}/${sunday.getDate()}`

let pinnedRows = [];
let overdueRows = [];
//This content only shows when viewing the current week
if (weekShift == 0){


  pinnedRows.push(...buildRows({
    rowLabel:"Pinned",
    assignments:pinnedArray,
    clickCallback,
    doubleClickCallback,
    completedArray,
    setCompletedArray,
    classTimes,
    weekShift,
    selectedItemId,
    showCompleted
  }));

  if (showOverdue){
    //Find overdue assignments
    const now = new Date();
    let overdueArray = [];
    for (let assignment of assignmentArray){
      const due = new Date(`${assignment.dueDate} UTC`);
      if (due > now){ break; }
      if (!completedArray.includes(assignment.doenetId)){
        overdueArray.push(assignment);
      }
    }

    overdueRows.push(...buildRows({
      rowLabel:"Overdue",
      assignments:overdueArray,
      clickCallback,
      doubleClickCallback,
      completedArray,
      setCompletedArray,
      classTimes,
      weekShift,
      selectedItemId,
      showCompleted
    }));
  }
  
}

let dayRows = [];

let beginningOfMondayDT = new Date(monday.getTime());
beginningOfMondayDT.setHours(0,0,0,0);
let endOfSundayDT = new Date(sunday.getTime());
endOfSundayDT.setHours(23,59,59,999);

//Add full assignment information to the day of the week by index
let dueByDOTW = [[],[],[],[],[],[],[]]; 
  for (let i = 0; i < assignmentArray.length; i++){
    let assignment = assignmentArray[i];
    let dueDate = new Date(`${assignment.dueDate} UTC`)
    if (dueDate < beginningOfMondayDT){ continue; }
    if (dueDate > endOfSundayDT){ break; }
    let assignmentDOTW = dueDate.getDay();
    dueByDOTW[assignmentDOTW].push({...assignment});
  }
  //Move sunday assignments to the end of the array
  dueByDOTW.push(dueByDOTW.shift())

const dotwLabel = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

  for (let [index,dayAssignments] of Object.entries(dueByDOTW)){

    dayRows.push(...buildRows({
      dotw:dotwLabel[index],
      assignments:dayAssignments,
      clickCallback,
      doubleClickCallback,
      completedArray,
      setCompletedArray,
      classTimes,
      weekShift,
      selectedItemId,
      showCompleted
    }));
   
  }
  

  return <>
  <div style={{
    display:"flex",
    // backgroundColor:"grey", 
    alignItems:"center", 
    justifyContent:"space-evenly",
    width:"850px",
    height:"70px"
    }}>
  <span><Button onClick={()=>setWeekShift(0)} value='This Week' /> </span>
  <h1>Current Content</h1>
  <span style={{fontSize:"1.4em"}}>{headerMonday} - {headerSunday}</span>
  <ButtonGroup>
    <span><Button onClick={()=>setWeekShift((was)=>was-1)} icon={<FontAwesomeIcon icon={faLessThan} />} /></span> 
    <span><Button onClick={()=>setWeekShift((was)=>was+1)} icon={<FontAwesomeIcon icon={faGreaterThan} />} /></span>
  </ButtonGroup>

  </div>
  
  <table style={{width:"850px",borderSpacing:"0em .2em"}}>
    <tr>
      <th style={{width:'150px',textAlign:'left'}}>Day</th>
      <th style={{width:'200px',textAlign:'left'}}>Name</th>
      <th style={{width:'200px',textAlign:'left'}}>Assigned</th>
      <th style={{width:'200px',textAlign:'left'}}>Due</th>
      <th style={{width:'100px',textAlign:'center'}}>Completed</th>
    </tr>
    {pinnedRows}
    {overdueRows}
    {dayRows}
  </table>
  </>
}

