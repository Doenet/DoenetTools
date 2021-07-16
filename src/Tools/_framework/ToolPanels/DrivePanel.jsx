import React, { Suspense } from 'react';
// import { useLocation } from 'react-router';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  toolViewAtom,
  searchParamAtomFamily,
  paramObjAtom,
} from '../NewToolRoot';
import Drive, {
  clearDriveAndItemSelections,
  globalSelectedNodesAtom,
  selectedDriveItemsAtom,
} from '../../../_reactComponents/Drive/NewDrive';
import {
  drivecardSelectedNodesAtom,
  fetchDrivesSelector,
  fetchDrivesQuery,
} from '../ToolHandlers/CourseToolHandler';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { DropTargetsProvider } from '../../../_reactComponents/DropTarget';
import { BreadcrumbProvider } from '../../../_reactComponents/Breadcrumb';

export default function DrivePanel() {
  // const path = useRecoilValue(searchParamAtomFamily('path'));
  const clearSelections = useRecoilCallback(
    ({ snapshot, set }) =>
      () => {
        const { globalItemsSelected } = snapshot
          .getLoadable(globalSelectedNodesAtom)
          .getValue();
        for (let itemObj of globalItemsSelected) {
          const { parentFolderId, ...atomFormat } = itemObj; //Without parentFolder
          set(selectedDriveItemsAtom(atomFormat), false);
        }
        if (globalItemsSelected.length > 0) {
          set(globalSelectedNodesAtom, []);
        }
        const globalDrivesSelected = snapshot
          .getLoadable(drivecardSelectedNodesAtom)
          .getValue();
        if (globalDrivesSelected.length > 0) {
          set(drivecardSelectedNodesAtom, []);
        }
      },
    [],
  );
  const setParamObj = useSetRecoilState(paramObjAtom);
  const path = useRecoilValue(searchParamAtomFamily('path'));

  return (
    <BreadcrumbProvider>
      <DropTargetsProvider>
        <Suspense fallback={<div>loading Drive...</div>}>
          <Container>
            <Drive
              path={path}
              // types={['content', 'course']}
              columnTypes={['Released', 'Public']}
              drivePathSyncKey="main"
              urlClickBehavior="select"
              doubleClickCallback={(info) => {
                // clearSelections();
                if (info.type === 'Folder') {
                  setParamObj((was) => ({
                    ...was,
                    path: `${info.driveId}:${info.parentFolderId}:${info.parentFolderId}:Folder`,
                  }));
                } else if (info.type === 'DoenetML') {
                  setParamObj({ tool: 'editor', doenetId: info.item.doenetId });
                }
              }}
            />
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
        // border: "1px red solid",
        margin: '10px 20px',
      }}
    >
      {props.children}
    </div>
  );
}

// // let location = useLocation();

//   // const setPath = useRecoilCallback(({set})=>(path)=>{
//   //   let urlParamsObj = Object.fromEntries(new URLSearchParams(location.search));
//   //   urlParamsObj['path'] = path;
//   //   const url = location.pathname + '?' + encodeParams(urlParamsObj);

//   //   window.history.pushState('','',`/new#${url}`)
//   //   set(searchParamAtomFamily('path'),path)
//   // })

//   const setSelections = useRecoilCallback(({set})=>(selections)=>{
//     console.log(">>>selections",selections)
//     set(selectedMenuPanelAtom,"SelectedDoenetId");
//     set(globalSelectedNodesAtom,selections);
//   })

//   //Keep this to speed up hiding
//   if (props.style?.display === "none"){
//     return <div style={props.style}></div>
//   }

//   return <div style={props.style}><h1>drive</h1>
//   <p>put drive here</p>
//   <div>path: {path}</div>
//   <div><button onClick={(e)=>{e.stopPropagation();setParamObj((was)=>{ let newObj = {...was}; newObj['path']='f1'; return newObj; })}}>path to f1</button></div>
//   <div><button onClick={(e)=>{e.stopPropagation();setParamObj((was)=>{ let newObj = {...was}; newObj['path']='f2'; return newObj; })}}>path to f2</button></div>
//   <div><button onClick={(e)=>{e.stopPropagation();setParamObj((was)=>{ let newObj = {...was}; newObj['path']='f3'; return newObj; })}}>path to f3</button></div>
//   <hr />
//   {/* set(selectedMenuPanelAtom,"SelectedDoenetId"); //replace selection */}

//   <div><button onClick={(e)=>{e.stopPropagation();setSelections(['f1'])}}>select f1</button></div>
//   <div><button onClick={(e)=>{e.stopPropagation();setSelections(['f1','f2'])}}>select f1 and f2</button></div>
//   <div><button onClick={(e)=>{e.stopPropagation();setParamObj({tool:'playground'})}}>go to playground</button></div>
//   </div>
