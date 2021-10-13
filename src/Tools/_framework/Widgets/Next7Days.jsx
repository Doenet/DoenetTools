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
//array of objects
//dotwIndex as a number starting at 0 for Sunday (the js standard)
//startTime as text "01:00"
//endTime as text "02:00"
export const classTimesAtom = atom({
  key:'classTimesAtom',
  default:[]
})

function formatAssignedDate(dt,classTimes,dueDT,thisWeek){
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
  if (returnValue === 'Invalid Date'){ returnValue = null;}

 return returnValue;
}

export default function Next7Days({ driveId }) {
  
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  // const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  // let [numColumns,setNumColumns] = useState(4);
  let [assignmentArray,setAssignmentArray] = useState([]);
  let [pinnedArray,setPinnedArray] = useState([]);
  let [initialized,setInitialized] = useState(false);
  let [problemMessage,setProblemMessage] = useState("");
  let [weekShift,setWeekShift] = useState(0); //-1 means 7 days before
  let classTimes = useRecoilValue(classTimesAtom);
  let selected = useRecoilValue(globalSelectedNodesAtom);
  let selectedItemId = null;
  if (selected[0]?.driveInstanceId === "currentContent"){
    selectedItemId = selected[0].itemId;
  }
  // console.log(">>>>selected",selected,selectedItemId)

  let loadAssignmentArray = useRecoilCallback(({snapshot,set})=> async (driveId)=>{
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
    () =>
      ({type,doenetId}) => {

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
  const firstRowDoenetId = pinnedArray[0]?.doenetId;
  for (let assignment of pinnedArray){
    pinnedRows.push(<tr key={`${assignment.doenetId}`}>
      {assignment.doenetId == firstRowDoenetId ? <td style={{fontSize:"1em"}} rowSpan={pinnedArray.length }>Pinned</td> : null}
      <td colSpan="3" onDoubleClick={()=>doubleClickCallback({type:assignment.itemType,doenetId:assignment.doenetId})}>{assignment.label}</td>
      </tr>)
  }
}

let dayRows = [];

let beginningOfMondayDT = new Date(monday.getTime());
beginningOfMondayDT.setHours(0,0,0,0);
let endOfSundayDT = new Date(sunday.getTime());
endOfSundayDT.setHours(23,59,59,999);

// for (let i = 0; i < assignmentArray.length; i++){
//   let assignment = assignmentArray[i];
//   let assignedDate = new Date(`${assignment.assignedDate} UTC`)
//   console.log(">>>>assignedDate",assignedDate)
// }
// console.log(">>>>------------------------")






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
  // console.log(">>>>dueByDOTW",dueByDOTW)

const dotwLabel = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

  for (let [index,dayAssignments] of Object.entries(dueByDOTW)){

    if (dayAssignments.length > 0){
      let assignment = dayAssignments[0];
      let assignedDate = new Date(`${assignment.assignedDate} UTC`)
      assignedDate.setSeconds(0,0);
      let dueDate = new Date(`${assignment.dueDate} UTC`);
      dueDate.setSeconds(0,0);
      let displayDueDate = formatDueDate(dueDate,classTimes) 
      let displayAssignedDate = formatAssignedDate(assignedDate,classTimes,dueDate,weekShift == 0);   
    
      let dayLabel = `${dotwLabel[index]} ${dueDate.getMonth() + 1}/${dueDate.getDate()}`

      //onDoubleClick={}
//onClick={()=>console.log(">>>>CLICK",assignment.doenetId)}
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
      
      let doubleClick = ()=>doubleClickCallback({type:assignment.itemType,doenetId:assignment.doenetId})
   
      dayRows.push(<tr key={`${assignment.doenetId}`} >
            <td rowSpan={dayAssignments.length}>{dayLabel}</td>
            <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{assignment.label}</td>
            <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{displayAssignedDate}</td>
            <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{displayDueDate}</td>
            </tr>)

      //if more than one item loop through the rest
      for (let i = 1; i < dayAssignments.length; i++){
        let assignment = dayAssignments[i];
        let assignedDate = new Date(`${assignment.assignedDate} UTC`)
        assignedDate.setSeconds(0,0);
        let dueDate = new Date(`${assignment.dueDate} UTC`);
        dueDate.setSeconds(0,0);
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
      let doubleClick = ()=>doubleClickCallback({type:assignment.itemType,doenetId:assignment.doenetId})

        dayRows.push(<tr key={`${assignment.doenetId}${i}`}>
        <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{assignment.label}</td>
        <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{displayAssignedDate}</td>
        <td style={{backgroundColor:bgColor}} onClick={oneClick} onDoubleClick={doubleClick}>{displayDueDate}</td>
        </tr>)
      }
    }
    
  }
  

  return <>
  <div style={{
    display:"flex",
    // backgroundColor:"grey", 
    alignItems:"center", 
    justifyContent:"space-evenly",
    width:"650px",
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
  
  {/* <table style={{width:"650px"}}> */}
  <table style={{width:"517px",borderSpacing:"0em .2em"}}>
    <tr>
      <th style={{width:'140px',textAlign:'left'}}>Day</th>
      <th style={{width:'141px',textAlign:'left'}}>Name</th>
      <th style={{width:'123px',textAlign:'left'}}>Assigned</th>
      <th style={{width:'123px',textAlign:'left'}}>Due</th>
      {/* <th style={{width:'123px',textAlign:'left'}}>Completed</th> */}
    </tr>
    {pinnedRows}
    {overdueRows}
    {dayRows}
  </table>
  </>
}

  // useEffect(() => {
  //   setMainPanelClear((was) => [
  //     ...was,
  //     { atom: clearDriveAndItemSelections, value: null },
  //     { atom: selectedMenuPanelAtom, value: null },
  //   ]);
  //   return setMainPanelClear((was) =>
  //     was.filter(
  //       (obj) =>
  //         obj.atom !== clearDriveAndItemSelections ||
  //         obj.atom !== selectedMenuPanelAtom,
  //     ),
  //   );
  // }, [setMainPanelClear]);

  // const filterCallback = useRecoilCallback(
  //   ({ snapshot }) =>
  //     (item) => {
  //       switch (view) {
  //         case 'student':
  //           if (item.itemType === itemType.FOLDER) {
  //             const folderContents = snapshot
  //               .getLoadable(
  //                 folderDictionary({
  //                   driveId: item.driveId,
  //                   folderId: item.itemId,
  //                 }),
  //               )
  //               .getValue()['contentsDictionary'];
  //             for (const key in folderContents) {
  //               if (folderContents[key].isReleased === '1') {
  //                 return true;
  //               }
  //             }
  //             return false;
  //           } else {
  //             console.log('whats up', item.itemType, 'i', item);
  //             return item.isReleased === '1';
  //           }
  //         case 'instructor':
  //           return true;
  //         default:
  //           console.warn('No view selected');
  //       }
  //     },
  //   [view],
  // );

  // let doenetMLsJSX = <div>There are no assignments due over the next seven days.</div> 
  // if (assignmentArray.length > 0){
  //   doenetMLsJSX = [];
  //   for (let item of assignmentArray){
  //     doenetMLsJSX.push(<DoenetML
  //           key={`item${item.itemId}${driveInstanceId}`}
  //           driveId={driveId}
  //           item={item}
  //           indentLevel={0}
  //           driveInstanceId={driveInstanceId}
  //           route={route}
  //           isNav={isNav}
  //           pathItemId={pathItemId}
  //           clickCallback={clickCallback}
  //           doubleClickCallback={doubleClickCallback}
  //           deleteItem={()=>{}}
  //           numColumns={numColumns} 
  //           columnTypes={columnTypes}
  //           isViewOnly={true}
  //         />)
  //   }
  // }
  

  // return (
  //   <BreadcrumbProvider>
  //     <DropTargetsProvider>
  //       <Suspense fallback={<div>loading Drive...</div>}>
  //         <Container>
  //           <h2>Current Content</h2>
  //           <DriveHeader
  //           columnTypes={columnTypes}
  //           numColumns={numColumns}
  //           setNumColumns={setNumColumns}
  //           driveInstanceId={driveInstanceId}
  //           />
  //           {doenetMLsJSX}
               
 
  //         </Container>
  //       </Suspense>
  //     </DropTargetsProvider>
  //   </BreadcrumbProvider>
  // );

// function Container(props) {
//   return (
//     <div
//       style={{
//         maxWidth: '850px',
//         margin: '10px 20px',
//         // border: "1px red solid",
//       }}
//     >
//       {props.children}
//     </div>
//   );
// }
