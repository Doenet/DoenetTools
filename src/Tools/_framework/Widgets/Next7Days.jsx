/**
 * External dependencies
 */
import React, { useState, Suspense, useEffect, useLayoutEffect } from 'react';
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
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

import { DropTargetsProvider } from '../../../_reactComponents/DropTarget';
import { BreadcrumbProvider } from '../../../_reactComponents/Breadcrumb/BreadcrumbProvider';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import axios from 'axios';


export default function Next7Days({ driveId }) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  let [numColumns,setNumColumns] = useState(4);
  let [assignmentArray,setAssignmentArray] = useState([]);
  let [initialized,setInitialized] = useState(false);
  let [problemMessage,setProblemMessage] = useState("");

  let loadAssignmentArray = useRecoilCallback(({snapshot,set})=> async (driveId)=>{
    const { data } = await axios.get('/api/loadNextSevenDays.php',{params:{driveId}});
    console.log(">>>>data",data)
    if (!data.success){
      setProblemMessage(data.message);
      return
    }
    if (data.assignments){
      setAssignmentArray(data.assignments);
    }

  })

  let view = 'Student';
  let columnTypes = ['Due Date']
  let isNav = false;
  let driveInstanceId = 'not used'; //TODO: make this unique so widget is independent of other instances
  let pathItemId = 'not used';
  let route = 'not used';

  useEffect(() => {
    setMainPanelClear((was) => [
      ...was,
      { atom: clearDriveAndItemSelections, value: null },
      { atom: selectedMenuPanelAtom, value: null },
    ]);
    return setMainPanelClear((was) =>
      was.filter(
        (obj) =>
          obj.atom !== clearDriveAndItemSelections ||
          obj.atom !== selectedMenuPanelAtom,
      ),
    );
  }, [setMainPanelClear]);


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
    ({ set }) =>
      (info) => {

        switch (info.type) {
          case itemType.DOENETML:
          
              //TODO: VariantIndex params
              setPageToolView({
                page: 'course',
                tool: 'assignment',
                view: '',
                params: {
                  doenetId: info.item.doenetId,
                },
              });
           

            break;
          case itemType.COLLECTION:

              setPageToolView({
                page: 'course',
                tool: 'assignment',
                view: '',
                params: {
                  doenetId: info.item.doenetId,
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
    [setPageToolView, view],
  );

  const filterCallback = useRecoilCallback(
    ({ snapshot }) =>
      (item) => {
        switch (view) {
          case 'student':
            if (item.itemType === itemType.FOLDER) {
              const folderContents = snapshot
                .getLoadable(
                  folderDictionary({
                    driveId: item.driveId,
                    folderId: item.itemId,
                  }),
                )
                .getValue()['contentsDictionary'];
              for (const key in folderContents) {
                if (folderContents[key].isReleased === '1') {
                  return true;
                }
              }
              return false;
            } else {
              console.log('whats up', item.itemType, 'i', item);
              return item.isReleased === '1';
            }
          case 'instructor':
            return true;
          default:
            console.warn('No view selected');
        }
      },
    [view],
  );



  if (!initialized && driveId !== ""){
    //Runs every time the page is returned to
    setInitialized(true)//prevent load on each refresh
    loadAssignmentArray(driveId);
  }

  if (problemMessage !== ''){
    return <div>
      <h2>{problemMessage}</h2>
    </div>
  }


  let doenetMLsJSX = <div>There are no assignments due over the next seven days.</div> 
  if (assignmentArray.length > 0){
    doenetMLsJSX = [];
    for (let item of assignmentArray){
      doenetMLsJSX.push(<DoenetML
            key={`item${item.itemId}${driveInstanceId}`}
            driveId={driveId}
            item={item}
            indentLevel={0}
            driveInstanceId={driveInstanceId}
            route={route}
            isNav={isNav}
            pathItemId={pathItemId}
            clickCallback={clickCallback}
            doubleClickCallback={doubleClickCallback}
            deleteItem={()=>{}}
            numColumns={numColumns} 
            columnTypes={columnTypes}
            isViewOnly={true}
          />)
    }
  }
  

  return (
    <BreadcrumbProvider>
      <DropTargetsProvider>
        <Suspense fallback={<div>loading Drive...</div>}>
          <Container>
            <h2>The Next Seven Days</h2>
            <DriveHeader
            columnTypes={columnTypes}
            numColumns={numColumns}
            setNumColumns={setNumColumns}
            driveInstanceId={driveInstanceId}
            />
            {doenetMLsJSX}
               
 
          </Container>
        </Suspense>
      </DropTargetsProvider>
    </BreadcrumbProvider>
  );
}

function Container(props) {
  return (
    <div
      style={{
        maxWidth: '850px',
        margin: '10px 20px',
        // border: "1px red solid",
      }}
    >
      {props.children}
    </div>
  );
}
