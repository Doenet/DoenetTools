/**
 * External dependencies
 */
import React, { Suspense, useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
/**
 * Internal dependencies
 */
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
import Drive from '../../../_reactComponents/Drive/NewDrive';
import { DropTargetsProvider } from '../../../_reactComponents/DropTarget';
import { BreadcrumbProvider } from '../../../_reactComponents/Breadcrumb';

export default function NavigationPanel() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const path = useRecoilValue(searchParamAtomFamily('path'));

  const filter = useCallback((item) => item.released === '1', []);

  const doubleClickCallback = useCallback(
    (info) => {
      switch (info.type) {
        case 'Folder':
          setPageToolView((was) => ({
            ...was,
            params: {
              path: `${info.driveId}:${info.parentFolderId}:${info.parentFolderId}:Folder`,
            },
          }));
          break;
        case 'DoenetML':
          setPageToolView({
            page: 'course',
            tool: 'editor',
            view: '',
            params: { doenetId: info.item.doenetId },
          });
          break;
        default:
          throw new Error('DrivePanel doubleClick info type not defined');
      }
    },
    [setPageToolView],
  );

  return (
    <BreadcrumbProvider>
      <DropTargetsProvider>
        <Suspense fallback={<div>loading Drive...</div>}>
          <Container>
            <Drive
              path={path}
              filter={filter}
              columnTypes={['Released', 'Public']}
              urlClickBehavior="select"
              doubleClickCallback={doubleClickCallback}
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
        margin: '10px 20px',
        // border: "1px red solid",
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
//   <div><button onClick={(e)=>{e.stopPropagation();setPageToolView((was)=>({...was,params:{path:'f1'}}))}}>path to f1</button></div>
//   <div><button onClick={(e)=>{e.stopPropagation();setPageToolView((was)=>({...was,params:{path:'f2'}}))}}>path to f2</button></div>
//   <div><button onClick={(e)=>{e.stopPropagation();setPageToolView((was)=>({...was,params:{path:'f3'}}))}}>path to f3</button></div>
//   <hr />
//   {/* set(selectedMenuPanelAtom,"SelectedDoenetId"); //replace selection */}

//   <div><button onClick={(e)=>{e.stopPropagation();setSelections(['f1'])}}>select f1</button></div>
//   <div><button onClick={(e)=>{e.stopPropagation();setSelections(['f1','f2'])}}>select f1 and f2</button></div>
//   <hr />
//   <div><button onClick={(e)=>{e.stopPropagation();setPageToolView((was)=>{ let newObj = {...was};newObj['tool'] = 'editor'; newObj['params']={doenetId:'JRP26MJwT93KkydNtBQpO'}; return newObj; })}}>Edit c1</button></div>

//   </div>
// }
