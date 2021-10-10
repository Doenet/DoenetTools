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
// import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
// import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import axios from 'axios';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';


//array of objects
//dotwIndex as a number starting at 0 for Sunday (the js standard)
//startTime as text "01:00"
//endTime as text "02:00"
export const classTimesAtom = atom({
  key:'classTimesAtom',
  default:[]
})


export default function Next7Days({ driveId }) {
  
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  // const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  let [numColumns,setNumColumns] = useState(4);
  let [assignmentArray,setAssignmentArray] = useState([]);
  let [pinnedArray,setPinnedArray] = useState([]);
  let [initialized,setInitialized] = useState(false);
  let [problemMessage,setProblemMessage] = useState("");
  let [weekShift,setWeekShift] = useState(0); //-1 means 7 days before

  let loadAssignmentArray = useRecoilCallback(({snapshot,set})=> async (driveId)=>{
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

  // const clickCallback = useRecoilCallback(
  //   ({ set }) =>
  //     (info) => {
  //       switch (info.instructionType) {
  //         case 'one item':
  //           set(selectedMenuPanelAtom, `Selected${info.type}`);
  //           break;
  //         case 'range to item':
  //         case 'add item':
  //           set(selectedMenuPanelAtom, `SelectedMulti`);
  //           break;
  //         case 'clear all':
  //           set(selectedMenuPanelAtom, null);
  //           break;
  //         default:
  //           throw new Error('NavigationPanel found invalid select instruction');
  //       }
  //       set(
  //         selectedDriveItems({
  //           driveId: info.driveId,
  //           driveInstanceId: info.driveInstanceId,
  //           itemId: info.itemId,
  //         }),
  //         {
  //           instructionType: info.instructionType,
  //           parentFolderId: info.parentFolderId,
  //         },
  //       );
  //       set(selectedDriveAtom, info.driveId);
  //     },
  //   [],
  // );

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

  let today = new Date();
  let diff = 1 - today.getDay();
  let monday = new Date(today.getTime() + (1000 * 60 * 60 * 24 * diff) + (1000 * 60 * 60 * 24 * weekShift * 7));
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
      {assignment.doenetId == firstRowDoenetId ? <td style={{fontSize:"1.4em"}} rowSpan={pinnedArray.length }>Pinned</td> : null}
      <td colSpan="3" onDoubleClick={()=>doubleClickCallback({type:assignment.itemType,doenetId:assignment.doenetId})}>{assignment.label}</td>
      </tr>)
  }



}

  // console.log(">>>>assignmentArray",assignmentArray)
let rows = [];
for (let assignment of assignmentArray){

  rows.push(<tr key={`${assignment.doenetId}`}>
    <td></td>
    <td>{assignment.label}</td>
    <td>{assignment.assignedDate}</td>
    <td>{assignment.dueDate}</td>
    </tr>)
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
  <span><Button onClick={()=>setWeekShift(0)} value='Today' /> </span>
  <h1>Current Content</h1>
  <span style={{fontSize:"1.4em"}}>{headerMonday} - {headerSunday}</span>
  <ButtonGroup>
    <span><Button onClick={()=>setWeekShift((was)=>was-1)} icon={<FontAwesomeIcon icon={faLessThan} />} /></span> 
    <span><Button onClick={()=>setWeekShift((was)=>was+1)} icon={<FontAwesomeIcon icon={faGreaterThan} />} /></span>
  </ButtonGroup>

  </div>
  
  {/* <table style={{width:"650px"}}> */}
  <table style={{width:"517px"}}>
    <tr>
      <th style={{width:'100px',textAlign:'left'}}>Day</th>
      <th style={{width:'151px',textAlign:'left'}}>Name</th>
      <th style={{width:'133px',textAlign:'left'}}>Assigned</th>
      <th style={{width:'133px',textAlign:'left'}}>Due</th>
      {/* <th style={{width:'133px',textAlign:'left'}}>Completed</th> */}
    </tr>
    {pinnedRows}
    {overdueRows}
    {rows}
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
