import React, {useState, useCallback, useEffect, useRef, useMemo, useContext} from 'react';
import './temp.css';
import axios from "axios";
import './util.css';
import nanoid from 'nanoid';
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  RecoilRoot,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {
  DropTargetsProvider,
} from '../imports/DropTarget';
import { 
  BreadcrumbProvider 
} from '../imports/Breadcrumb';

import Drive, {folderDictionarySelector} from '../imports/Drive'
import AddItem from '../imports/AddItem'
export default function app() {
return <RecoilRoot>
        <DropTargetsProvider>
          <BreadcrumbProvider>
           <Demo />        
          </BreadcrumbProvider>
        </DropTargetsProvider>
</RecoilRoot>
};
import Tool from "../imports/Tool/Tool";



function Demo(){
  console.log("=== Demo")
  let [hideUnpublished,setHideUnpublished] = useState(false)

  let [hideUnpublished,setHideUnpublished] = useState(false)
  let setFolderInfo = useSetRecoilState(folderDictionarySelector({driveId:"ZLHh5s8BWM2azTVFhazIH",folderId:"ZLHh5s8BWM2azTVFhazIH"}))
  const publishContentButton = <button onClick={()=>{
    setFolderInfo({instructionType:"content was published",itemId:"29hfuBErLnrwTiDpltU9q"})
  }}>Publish Content</button>
  const publishAssignmentButton = <button onClick={()=>{
    setFolderInfo({instructionType:"assignment was published",itemId:"29hfuBErLnrwTiDpltU9q"})
  }}>Publish Assignment</button>
  
  
  let publishText = "Show Student View";
  if (hideUnpublished){publishText = "Show Instructor View"}
  
  let publishButton = <div><button onClick={()=>setHideUnpublished((old)=>!old)}>{publishText}</button></div>
  
  const publishContentButton = <button onClick={()=>{
    setFolderInfo({instructionType:"content was published",itemId:"29hfuBErLnrwTiDpltU9q"})
  }}>Publish Content</button>
  const publishAssignmentButton = <button onClick={()=>{
    setFolderInfo({instructionType:"assignment was published",itemId:"29hfuBErLnrwTiDpltU9q"})
  }}>Publish Assignment</button>
  
  return <>

  {/* <Drive types={['course']} urlClickBehavior="select" /> */}
  {/* <Drive driveId='ZLHh5s8BWM2azTVFhazIH' rootCollapsible={true} /> */}
  {/* <h2>Select</h2> */}
  {publishContentButton}
  {publishAssignmentButton}
  {publishButton}
  {hideUnpublished ? <p>hideUnpublished is True</p> : <p>hideUnpublished is False</p>}
  <Drive driveId='ZLHh5s8BWM2azTVFhazIH' hideUnpublished={hideUnpublished} urlClickBehavior="select"/>
  {/* <Drive driveId='ZLHh5s8BWM2azTVFhazIH' urlClickBehavior="select"/> */}
  {/* <Drive driveId='ZLHh5s8BWM2azTVFhazIH' urlClickBehavior="new tab"/> */}
  {/* <h2>Default</h2>
  <Drive driveId='ZLHh5s8BWM2azTVFhazIH' /> */}
  </>
}





















// import React, {useState, useCallback, useEffect, useRef, useMemo, useContext} from 'react';
// import './temp.css';
// import axios from "axios";
// import './util.css';
// import nanoid from 'nanoid';
// import {
//   HashRouter as Router,
//   Switch,
//   Route,
//   useHistory
// } from "react-router-dom";

// import {
//   atom,
//   atomFamily,
//   selector,
//   selectorFamily,
//   RecoilRoot,
//   useSetRecoilState,
//   useRecoilValueLoadable,
//   useRecoilStateLoadable,
//   useRecoilState,
//   useRecoilValue,
// } from 'recoil';

// import {
//   DropTargetsProvider,
// } from '../imports/DropTarget';
// import { 
//   BreadcrumbProvider 
// } from '../imports/Breadcrumb';

// import Drive from '../imports/Drive'
// import AddItem from '../imports/AddItem'



// export default function app() {
// return <RecoilRoot>
//         <DropTargetsProvider>
//           <BreadcrumbProvider>
//            <Demo />        
//           </BreadcrumbProvider>
//         </DropTargetsProvider>
// </RecoilRoot>
// };


// function Demo(){
//   console.log("=== Demo")

//   return <>

//   <AddItem />
//   {/* <Drive types={['course']} urlClickBehavior="select" /> */}
//   {/* <Drive driveId='ZLHh5s8BWM2azTVFhazIH' rootCollapsible={true} /> */}
//   {/* <h2>Select</h2> */}

//   <Drive driveId='ZLHh5s8BWM2azTVFhazIH' />
//   <Drive driveId='ZLHh5s8BWM2azTVFhazIH' urlClickBehavior="select"/>
//   {/* <Drive driveId='ZLHh5s8BWM2azTVFhazIH' urlClickBehavior="new tab"/> */}
//   {/* <h2>Default</h2>
//   <Drive driveId='ZLHh5s8BWM2azTVFhazIH' /> */}

//   </>
// }


